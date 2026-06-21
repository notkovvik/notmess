package com.notmess.app.ui.chats

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.notmess.app.R
import com.notmess.app.model.Chat
import com.notmess.app.model.User
import com.notmess.app.util.setAvatar

data class ChatListItem(val chat: Chat? = null, val user: User? = null, val favText: String? = null)

class ChatAdapter(
    private var items: MutableList<ChatListItem>,
    private val onClick: (Any) -> Unit
) : RecyclerView.Adapter<ChatAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val avatar: TextView = view.findViewById(R.id.chatAvatar)
        val name: TextView = view.findViewById(R.id.chatName)
        val lastMsg: TextView = view.findViewById(R.id.lastMessage)
        val time: TextView = view.findViewById(R.id.time)
        val unread: TextView = view.findViewById(R.id.unreadBadge)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.item_chat, parent, false))
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        when {
            item.chat != null -> {
                val chat = item.chat
                val other = if (chat.isChannel) "" else
                    chat.participant1.takeIf { it != item.user?.username } ?: chat.participant2
                if (chat.isChannel) {
                    holder.avatar.text = "#"
                    holder.avatar.setBackgroundResource(R.drawable.bg_avatar)
                } else {
                    setAvatar(holder.avatar, other)
                }
                holder.name.text = if (chat.isChannel) (chat.channelName ?: "Канал") else (item.user?.firstname ?: other)
                holder.lastMsg.text = chat.lastMessage ?: ""
                holder.time.text = chat.lastMessageTime ?: ""
                holder.unread.visibility = View.GONE
                holder.itemView.setOnClickListener { onClick(chat) }
            }
            item.user != null -> {
                val user = item.user
                setAvatar(holder.avatar, user.firstname)
                holder.name.text = buildString {
                    append(user.firstname)
                    if (user.lastname.isNotEmpty()) append(" ${user.lastname}")
                }
                holder.lastMsg.text = "@${user.username.removePrefix("@")}"
                holder.time.text = ""
                holder.unread.visibility = View.GONE
                holder.itemView.setOnClickListener { onClick(user) }
            }
            item.favText != null -> {
                holder.avatar.text = "★"
                holder.name.text = "Избранное"
                holder.lastMsg.text = item.favText
                holder.time.text = ""
                holder.unread.visibility = View.GONE
            }
        }
    }

    override fun getItemCount() = items.size

    fun update(newItems: List<ChatListItem>) {
        items.clear()
        items.addAll(newItems)
        notifyDataSetChanged()
    }
}
