package com.notmess.app.api

import com.notmess.app.model.*
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.net.ssl.*

interface ApiService {
    @POST("api/auth/code")
    suspend fun sendAuthCode(@Body body: AuthCodeRequest): ServerResponse

    @POST("api/auth/verify")
    suspend fun verifyAuthCode(@Body body: AuthVerifyRequest): AuthVerifyResponse

    @GET("api/users/{username}")
    suspend fun getUser(@Path("username") username: String): User

    @POST("api/users")
    suspend fun createUser(@Body user: User): ServerResponse

    @GET("api/users")
    suspend fun getUsers(): List<User>

    @GET("api/users/search/{query}")
    suspend fun searchUsers(@Path("query") query: String): List<User>

    @GET("api/chats/{username}")
    suspend fun getChats(@Path("username") username: String): List<Chat>

    @POST("api/chats")
    suspend fun createChat(@Body chat: Chat): Chat

    @GET("api/messages/{chatId}")
    suspend fun getMessages(@Path("chatId") chatId: String): List<Message>

    @POST("api/messages")
    suspend fun sendMessage(@Body message: Message): ServerResponse

    @Multipart
    @POST("api/upload")
    suspend fun uploadFile(@Part file: okhttp3.MultipartBody.Part): ServerResponse

    @GET("api/favorites/{username}")
    suspend fun getFavorites(@Path("username") username: String): List<Favorite>

    @POST("api/favorites")
    suspend fun addFavorite(@Body body: Map<String, String>): ServerResponse

    @DELETE("api/favorites/{id}")
    suspend fun deleteFavorite(@Path("id") id: Long): ServerResponse

    @POST("api/telegram")
    suspend fun telegramApi(@Body body: TelegramRequest): TelegramResponse

    @POST("api/users/photo")
    suspend fun importPhoto(@Body body: Map<String, String>): ServerResponse

    companion object {
        const val BASE_URL = "https://web.notmess.ru/"

        fun create(): ApiService {
            val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
                override fun checkClientTrusted(chain: Array<X509Certificate>, authType: String) {}
                override fun checkServerTrusted(chain: Array<X509Certificate>, authType: String) {}
                override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
            })
            val sslContext = SSLContext.getInstance("TLS")
            sslContext.init(null, trustAllCerts, java.security.SecureRandom())
            val client = OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .sslSocketFactory(sslContext.socketFactory, trustAllCerts[0] as X509TrustManager)
                .hostnameVerifier { _, _ -> true }
                .build()
            val gson = com.google.gson.GsonBuilder()
                .registerTypeAdapter(Boolean::class.java, object : com.google.gson.JsonDeserializer<Boolean> {
                    override fun deserialize(json: com.google.gson.JsonElement, type: java.lang.reflect.Type, ctx: com.google.gson.JsonDeserializationContext): Boolean {
                        if (json.isJsonPrimitive) {
                            val p = json.asJsonPrimitive
                            if (p.isBoolean) return p.asBoolean
                            if (p.isNumber) return p.asInt != 0
                            if (p.isString) return p.asString == "1" || p.asString.lowercase() == "true"
                        }
                        return false
                    }
                })
                .registerTypeAdapter(java.lang.Boolean::class.java, object : com.google.gson.JsonDeserializer<Boolean> {
                    override fun deserialize(json: com.google.gson.JsonElement, type: java.lang.reflect.Type, ctx: com.google.gson.JsonDeserializationContext): Boolean {
                        if (json.isJsonPrimitive) {
                            val p = json.asJsonPrimitive
                            if (p.isBoolean) return p.asBoolean
                            if (p.isNumber) return p.asInt != 0
                            if (p.isString) return p.asString == "1" || p.asString.lowercase() == "true"
                        }
                        return false
                    }
                })
                .create()
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build()
                .create(ApiService::class.java)
        }
    }
}
