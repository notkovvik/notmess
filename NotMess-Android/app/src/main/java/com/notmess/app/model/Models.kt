package com.notmess.app.model

import com.google.gson.annotations.SerializedName

data class User(
    val username: String = "",
    val firstname: String = "",
    val lastname: String = "",
    val displayUsername: String = "",
    val chatId: String? = null,
    val avatarUrl: String? = null,
    val publicKey: String? = null,
    val badge: String? = null,
    val createdAt: String? = null
)

data class Chat(
    val id: String = "",
    val participant1: String = "",
    val participant2: String = "",
    @SerializedName("isChannel") val isChannel: Boolean = false,
    val channelName: String? = null,
    val lastMessage: String? = null,
    val lastMessageTime: String? = null,
    val createdAt: String? = null
)

data class Message(
    val id: Long = 0,
    val chatId: String = "",
    val text: String? = null,
    val fileUrl: String? = null,
    val fileType: String? = null,
    val fileName: String? = null,
    val time: String = "",
    val sender: String = "",
    val timestamp: String? = null
)

data class AuthCodeRequest(val username: String, val code: String, val chatId: String?)
data class AuthVerifyRequest(val username: String, val code: String)
data class AuthVerifyResponse(val valid: Boolean, val expired: Boolean? = null, val chatId: String? = null)
data class ServerResponse(val success: Boolean, val error: String? = null, val id: Long? = null, val username: String? = null, val message: String? = null)
data class TelegramRequest(val method: String, val params: Map<String, Any?>)
data class TelegramResponse(val ok: Boolean, val description: String? = null)

data class Favorite(
    val id: Long = 0,
    val username: String = "",
    val messageId: Long? = null,
    val text: String? = null,
    val fileUrl: String? = null,
    val fileType: String? = null,
    val fileName: String? = null,
    val time: String? = null,
    val timestamp: String? = null
)
