package com.notmess.app.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.notmess.app.MainActivity
import com.notmess.app.NotMessApp
import com.notmess.app.R
import com.notmess.app.model.AuthCodeRequest
import com.notmess.app.model.AuthVerifyRequest
import com.notmess.app.model.TelegramRequest
import com.notmess.app.model.TelegramResponse
import com.notmess.app.model.User
import kotlinx.coroutines.*

class AuthActivity : AppCompatActivity() {
    private lateinit var api: com.notmess.app.api.ApiService
    private lateinit var usernameInput: EditText
    private lateinit var codeInput: EditText
    private lateinit var codeLayout: LinearLayout
    private lateinit var authBtn: Button
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        setTheme(R.style.Theme_NotMess)
        setContentView(R.layout.activity_auth)
        api = (application as NotMessApp).api

        usernameInput = findViewById(R.id.usernameInput)
        codeInput = findViewById(R.id.codeInput)
        codeLayout = findViewById(R.id.codeLayout)
        authBtn = findViewById(R.id.authBtn)

        usernameInput.setOnEditorActionListener { _, _, _ -> sendCode(); true }

        authBtn.setOnClickListener {
            if (codeLayout.visibility == View.VISIBLE) verifyCode() else sendCode()
        }
    }

    private fun sendCode() {
        val username = usernameInput.text.toString().trim().lowercase().removePrefix("@")
        if (username.isEmpty()) { Toast.makeText(this, "Введите username", Toast.LENGTH_SHORT).show(); return }

        authBtn.isEnabled = false
        scope.launch {
            try {
                val user = try { api.getUser("@" + username) } catch (_: Exception) { null }
                var chatId = user?.chatId
                if (chatId == null) {
                    val updates = api.telegramApi(TelegramRequest("getUpdates", emptyMap()))
                    if (updates.ok) {
                        Toast.makeText(this@AuthActivity, "Напишите боту @notmess_autobot любое сообщение и попробуйте снова", Toast.LENGTH_LONG).show()
                        authBtn.isEnabled = true
                        return@launch
                    }
                }
                val code = (10000 until 99999).random().toString()
                val saveResp = api.sendAuthCode(AuthCodeRequest("@" + username, code, chatId))
                if (!saveResp.success) throw Exception("Ошибка сохранения кода")
                val tgResp = api.telegramApi(TelegramRequest("sendMessage", mapOf(
                    "chat_id" to chatId,
                    "text" to "🔐 Ваш код подтверждения для NotMess:\n\n<code>$code</code>\n\n<i>Нажмите на код, чтобы скопировать</i>\n\nUsername: @$username",
                    "parse_mode" to "HTML"
                )))
                if (tgResp.ok) {
                    codeLayout.visibility = View.VISIBLE
                    authBtn.text = "Подтвердить"
                    Toast.makeText(this@AuthActivity, "Код отправлен в Telegram", Toast.LENGTH_LONG).show()
                } else {
                    throw Exception("Ошибка отправки: ${tgResp.description}")
                }
            } catch (e: Exception) {
                Toast.makeText(this@AuthActivity, "Ошибка: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                authBtn.isEnabled = true
            }
        }
    }

    private fun verifyCode() {
        val username = "@" + usernameInput.text.toString().trim().lowercase().removePrefix("@")
        val code = codeInput.text.toString().trim()
        if (code.length != 5) { Toast.makeText(this, "Код — 5 цифр", Toast.LENGTH_SHORT).show(); return }

        authBtn.isEnabled = false
        scope.launch {
            try {
                val resp = api.verifyAuthCode(AuthVerifyRequest(username, code))
                if (resp.valid) {
                    getSharedPreferences("notmess", MODE_PRIVATE).edit().putString("username", username).apply()
                    val user = try { api.getUser(username) } catch (_: Exception) { null }
                    if (user == null || user.firstname.isEmpty()) {
                        showSetupDialog(username)
                    } else {
                        startActivity(Intent(this@AuthActivity, MainActivity::class.java))
                        finish()
                    }
                } else {
                    val msg = if (resp.expired == true) "Код истёк, запросите новый" else "Неверный код"
                    Toast.makeText(this@AuthActivity, msg, Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@AuthActivity, "Ошибка: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                authBtn.isEnabled = true
            }
        }
    }

    private fun showSetupDialog(username: String) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_setup, null)
        val firstInput = dialogView.findViewById<EditText>(R.id.firstnameInput)
        val lastInput = dialogView.findViewById<EditText>(R.id.lastnameInput)

        AlertDialog.Builder(this, com.google.android.material.R.style.ThemeOverlay_Material3_Dialog_Alert)
            .setTitle("Настройка профиля")
            .setView(dialogView)
            .setPositiveButton("Готово") { _, _ ->
                val first = firstInput.text.toString().trim()
                if (first.isEmpty()) { Toast.makeText(this, "Имя обязательно", Toast.LENGTH_SHORT).show(); return@setPositiveButton }
                scope.launch {
                    try {
                        val chatId = getSharedPreferences("notmess", MODE_PRIVATE).getString("chatId", null)
                        api.createUser(User(username = username, firstname = first, lastname = lastInput.text.toString().trim(), displayUsername = username, chatId = chatId))
                        startActivity(Intent(this@AuthActivity, MainActivity::class.java))
                        finish()
                    } catch (e: Exception) {
                        Toast.makeText(this@AuthActivity, "Ошибка", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            .setCancelable(false)
            .show()
    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }
}
