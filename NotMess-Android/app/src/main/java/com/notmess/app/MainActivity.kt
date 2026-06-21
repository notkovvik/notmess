package com.notmess.app

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.notmess.app.api.ApiService
import com.notmess.app.model.*
import com.notmess.app.ui.chats.ChatAdapter
import com.notmess.app.ui.chats.ChatListItem
import com.notmess.app.ui.messages.MessagesActivity
import kotlinx.coroutines.*

class MainActivity : AppCompatActivity() {
    private lateinit var api: ApiService
    private lateinit var recycler: RecyclerView
    private lateinit var emptyText: TextView
    private lateinit var searchInput: EditText
    private lateinit var tabChats: TextView
    private lateinit var tabUsers: TextView
    private lateinit var tabFavorites: TextView
    private var currentUser: User? = null
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private var currentTab = 0
    private var allChats = mutableListOf<ChatListItem>()
    private var allUsers = mutableListOf<ChatListItem>()
    private var textWatcher: android.text.TextWatcher? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        api = (application as NotMessApp).api

        recycler = findViewById(R.id.recyclerView)
        emptyText = findViewById(R.id.emptyText)
        searchInput = findViewById(R.id.searchInput)
        tabChats = findViewById(R.id.tabChats)
        tabUsers = findViewById(R.id.tabUsers)
        tabFavorites = findViewById(R.id.tabFavorites)

        val themeBtn = findViewById<ImageButton>(R.id.themeBtn)
        val menuBtn = findViewById<ImageButton>(R.id.menuBtn)

        recycler.layoutManager = LinearLayoutManager(this)
        recycler.adapter = ChatAdapter(mutableListOf()) { item ->
            when (item) {
                is Chat -> openChat(item)
                is User -> startChatWithUser(item)
            }
        }

        tabChats.setOnClickListener { selectTab(0) }
        tabUsers.setOnClickListener { selectTab(1) }
        tabFavorites.setOnClickListener { selectTab(2) }

        menuBtn.setOnClickListener {
            val version = "v${packageManager.getPackageInfo(packageName, 0).versionName}"
            showMenuDialog(version)
        }

        themeBtn.setOnClickListener {
            val isDark = (searchInput.context.resources.configuration.uiMode and
                android.content.res.Configuration.UI_MODE_NIGHT_MASK) ==
                android.content.res.Configuration.UI_MODE_NIGHT_YES
            val mode = if (isDark) android.app.UiModeManager.MODE_NIGHT_NO
                else android.app.UiModeManager.MODE_NIGHT_YES
            val manager = getSystemService(android.app.UiModeManager::class.java)
            manager.nightMode = mode
        }

        setupSearch()

        scope.launch {
            val uname = getSharedPreferences("notmess", MODE_PRIVATE).getString("username", null)
            if (uname == null) { finish(); return@launch }
            currentUser = try { api.getUser(uname) } catch (_: Exception) { null }
            if (currentUser == null) {
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("Сервер недоступен")
                    .setMessage("Не удалось подключиться к серверу.\nУбедитесь, что сервер запущен.")
                    .setPositiveButton("Повторить") { _, _ -> recreate() }
                    .setNegativeButton("Выйти") { _, _ -> finish() }
                    .setCancelable(false)
                    .show()
                return@launch
            }
            selectTab(0)
        }
    }

    private fun setupSearch() {
        textWatcher = object : android.text.TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: android.text.Editable?) {
                filterList(s.toString().trim().lowercase())
            }
        }
        searchInput.addTextChangedListener(textWatcher)
    }

    private fun filterList(query: String) {
        val source = when (currentTab) {
            1 -> allUsers; else -> allChats
        }
        val list = if (query.isEmpty()) source else source.filter { item ->
            val name = when {
                item.user != null -> "${item.user.firstname} ${item.user.lastname} @${item.user.username}"
                item.chat?.isChannel == true -> item.chat.channelName ?: ""
                item.chat != null -> {
                    val other = item.chat.participant1.takeIf { it != currentUser?.username } ?: item.chat.participant2
                    other + " ${item.user?.firstname}"
                }
                else -> ""
            }
            name.lowercase().contains(query)
        }
        (recycler.adapter as ChatAdapter).update(list)
        emptyText.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
        emptyText.text = when (currentTab) {
            1 -> if (query.isEmpty()) "Нет пользователей" else "Ничего не найдено"
            2 -> "Нет избранного"
            else -> if (query.isEmpty()) "Нет чатов" else "Ничего не найдено"
        }
    }

    private fun selectTab(index: Int) {
        currentTab = index
        tabChats.setTextColor(if (index == 0) getColor(R.color.text) else getColor(R.color.text2))
        tabUsers.setTextColor(if (index == 1) getColor(R.color.text) else getColor(R.color.text2))
        tabFavorites.setTextColor(if (index == 2) getColor(R.color.text) else getColor(R.color.text2))
        searchInput.text.clear()
        when (index) { 0 -> loadChats(); 1 -> loadUsers(); 2 -> loadFavorites() }
    }

    private fun loadChats() {
        scope.launch {
            try {
                val list = api.getChats(currentUser!!.username)
                allChats = list.map { chat ->
                    if (chat.isChannel) ChatListItem(chat = chat)
                    else {
                        val other = chat.participant1.let { if (it == currentUser!!.username) chat.participant2 else chat.participant1 }
                        val user = try { api.getUser(other) } catch (_: Exception) { null }
                        ChatListItem(chat = chat, user = user)
                    }
                }.toMutableList()
                (recycler.adapter as ChatAdapter).update(allChats)
            } catch (e: Exception) {
                Toast.makeText(this@MainActivity, "Ошибка загрузки: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun loadUsers() {
        scope.launch {
            try {
                val list = api.getUsers()
                allUsers = list.filter { it.username != currentUser!!.username }
                    .map { ChatListItem(user = it) }.toMutableList()
                (recycler.adapter as ChatAdapter).update(allUsers)
            } catch (_: Exception) {}
        }
    }

    private fun loadFavorites() {
        scope.launch {
            try {
                val list = api.getFavorites(currentUser!!.username)
                (recycler.adapter as ChatAdapter).update(list.map { ChatListItem(favText = it.text ?: it.fileName ?: "Файл") }.toMutableList())
            } catch (_: Exception) {}
        }
    }

    private fun openChat(chat: Chat) {
        val other = if (chat.isChannel) chat.channelName ?: "Канал"
            else chat.participant1.let { if (it == currentUser!!.username) chat.participant2 else chat.participant1 }
        val title = if (chat.isChannel) chat.channelName ?: "Канал" else other.removePrefix("@")
        val intent = Intent(this, MessagesActivity::class.java).apply {
            putExtra("chatId", chat.id)
            putExtra("title", title)
        }
        startActivity(intent)
    }

    private fun startChatWithUser(user: User) {
        scope.launch {
            try {
                val existing = api.getChats(currentUser!!.username)
                val found = existing.find { c ->
                    !c.isChannel && (c.participant1 == user.username || c.participant2 == user.username)
                }
                if (found != null) openChat(found)
                else {
                    val chat = api.createChat(Chat(
                        id = "chat_${currentUser!!.username}_${user.username}_${System.currentTimeMillis()}",
                        participant1 = currentUser!!.username,
                        participant2 = user.username
                    ))
                    openChat(chat)
                }
            } catch (e: Exception) {
                Toast.makeText(this@MainActivity, "Ошибка: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showMenuDialog(version: String) {
        val builder = AlertDialog.Builder(this)
        val items = mutableListOf("Профиль")
        if (currentUser?.username == "@notkovvik") items.add("Админка")
        items.add("Выйти")
        builder.setTitle("NotMess $version")
        builder.setItems(items.toTypedArray()) { _, which ->
            when (items[which]) {
                "Профиль" -> showProfileDialog()
                "Админка" -> Toast.makeText(this, "Админка в веб-версии", Toast.LENGTH_SHORT).show()
                "Выйти" -> {
                    getSharedPreferences("notmess", MODE_PRIVATE).edit().remove("username").apply()
                    startActivity(Intent(this, com.notmess.app.ui.auth.AuthActivity::class.java))
                    finish()
                }
            }
        }
        builder.show()
    }

    private fun showProfileDialog() {
        val user = currentUser ?: return
        val name = buildString {
            append(user.firstname)
            if (user.lastname.isNotEmpty()) append(" ${user.lastname}")
        }
        AlertDialog.Builder(this)
            .setTitle(name)
            .setMessage("@" + user.username.removePrefix("@"))
            .setPositiveButton("OK", null)
            .show()
    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }
}
