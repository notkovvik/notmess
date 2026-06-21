package com.notmess.app.ui.messages

import android.net.Uri
import android.os.Bundle
import android.view.View
import android.provider.OpenableColumns
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.notmess.app.NotMessApp
import com.notmess.app.R
import com.notmess.app.model.Message
import com.notmess.app.util.setAvatar
import kotlinx.coroutines.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

class MessagesActivity : AppCompatActivity() {
    private lateinit var api: com.notmess.app.api.ApiService
    private lateinit var recycler: RecyclerView
    private lateinit var emptyText: TextView
    private lateinit var input: EditText
    private lateinit var sendBtn: ImageButton
    private lateinit var attachBtn: ImageButton
    private lateinit var backBtn: ImageButton
    private lateinit var chatName: TextView
    private lateinit var chatStatus: TextView
    private lateinit var chatAvatar: TextView
    private lateinit var adapter: MessageAdapter
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private var chatId = ""
    private var currentUser = ""
    private var polling = true
    private var pendingFile: Uri? = null
    private var pendingFileName = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_messages)
        api = (application as NotMessApp).api

        chatId = intent.getStringExtra("chatId") ?: return finish()
        currentUser = getSharedPreferences("notmess", MODE_PRIVATE).getString("username", "") ?: ""

        recycler = findViewById(R.id.messagesRecycler)
        emptyText = findViewById(R.id.emptyText)
        input = findViewById(R.id.messageInput)
        sendBtn = findViewById(R.id.sendBtn)
        attachBtn = findViewById(R.id.attachBtn)
        backBtn = findViewById(R.id.backBtn)
        chatName = findViewById(R.id.chatName)
        chatStatus = findViewById(R.id.chatStatus)
        chatAvatar = findViewById(R.id.chatAvatar)

        val title = intent.getStringExtra("title") ?: "Чат"
        chatName.text = title
        setAvatar(chatAvatar, title)

        backBtn.setOnClickListener { finish() }

        adapter = MessageAdapter(mutableListOf<Any>(), currentUser,
            onReply = { msg ->
                input.hint = "Ответить ${msg.sender.removePrefix("@")}: ${msg.text?.take(30) ?: ""}"
                input.requestFocus()
            },
            onDelete = { msg ->
                scope.launch {
                    try { api.sendMessage(Message(id = msg.id, chatId = "", text = "", sender = "")) }
                    catch (_: Exception) {}
                    loadMessages()
                }
            }
        )
        recycler.layoutManager = LinearLayoutManager(this)
        (recycler.layoutManager as LinearLayoutManager).stackFromEnd = true
        recycler.adapter = adapter

        sendBtn.setOnClickListener { sendMessage() }
        attachBtn.setOnClickListener { pickFile() }

        loadMessages()
        startPolling()
    }

    private fun pickFile() {
        val intent = android.content.Intent(android.content.Intent.ACTION_GET_CONTENT).apply {
            type = "*/*"
            putExtra(android.content.Intent.EXTRA_MIME_TYPES, arrayOf("image/*", "video/*", "application/pdf", "application/zip", "text/*", "audio/*"))
        }
        startActivityForResult(intent, FILE_PICK_REQUEST)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: android.content.Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == FILE_PICK_REQUEST && resultCode == RESULT_OK && data?.data != null) {
            pendingFile = data.data
            pendingFileName = getFileName(pendingFile!!)
            Toast.makeText(this, "Файл: $pendingFileName", Toast.LENGTH_SHORT).show()
        }
    }

    private fun getFileName(uri: Uri): String {
        var name = "file"
        contentResolver.query(uri, null, null, null, null)?.use { cursor ->
            if (cursor.moveToFirst()) {
                val idx = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                if (idx >= 0) name = cursor.getString(idx)
            }
        }
        return name
    }

    private fun loadMessages() {
        scope.launch {
            try {
                val msgs = api.getMessages(chatId)
                adapter.update(msgs)
                emptyText.visibility = if (msgs.isEmpty()) View.VISIBLE else View.GONE
                if (msgs.isNotEmpty()) recycler.scrollToPosition(adapter.itemCount - 1)
            } catch (e: Exception) {
                Toast.makeText(this@MessagesActivity, "Ошибка загрузки: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun sendMessage() {
        val text = input.text.toString().trim()
        val uri = pendingFile

        if (text.isEmpty() && uri == null) return

        input.text.clear()
        pendingFile = null

        scope.launch {
            try {
                if (uri != null) {
                    val inputStream = contentResolver.openInputStream(uri)
                    val bytes = inputStream?.readBytes() ?: return@launch
                    inputStream.close()
                    val mimeType = contentResolver.getType(uri) ?: "application/octet-stream"
                    val requestBody = bytes.toRequestBody(mimeType.toMediaTypeOrNull())
                    val part = MultipartBody.Part.createFormData("file", pendingFileName, requestBody)
                    val uploadResp = api.uploadFile(part)
                    val fileUrl = uploadResp.message ?: ""
                    api.sendMessage(Message(
                        chatId = chatId,
                        text = text,
                        sender = currentUser,
                        fileUrl = fileUrl,
                        fileType = mimeType,
                        fileName = pendingFileName
                    ))
                    pendingFileName = ""
                } else {
                    api.sendMessage(Message(chatId = chatId, text = text, sender = currentUser))
                }
                loadMessages()
            } catch (e: Exception) {
                Toast.makeText(this@MessagesActivity, "Ошибка: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun startPolling() {
        scope.launch {
            while (polling) {
                delay(2000)
                try {
                    val msgs = api.getMessages(chatId)
                    adapter.update(msgs)
                } catch (_: Exception) {}
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        polling = false
        scope.cancel()
    }

    companion object {
        private const val FILE_PICK_REQUEST = 1001
    }
}
