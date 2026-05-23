import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import java.util.concurrent.ConcurrentHashMap

private val sessionMessageCount = ConcurrentHashMap<String, Int>()

private val goodbyeKeywords = listOf(
    "do widzenia", "do zobaczenia", "papa", "zegnaj",
    "na razie", "narazie", "koniec", "bye", "goodbye",
)

private fun isGoodbye(text: String): Boolean {
    val lowered = text.lowercase().trim()
    return goodbyeKeywords.any { lowered.contains(it) }
}

suspend fun startDiscordBot(token: String) {
    val kord = Kord(token)

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot == true) return@on

        val content = message.content
        val sessionKey = message.channelId.toString()

        val shopReply = ShopService.processCommand(content)
        if (shopReply != null) {
            message.channel.createMessage(shopReply)
            return@on
        }

        val count = sessionMessageCount.getOrDefault(sessionKey, 0)
        val isFirst = count == 0
        val isLast = isGoodbye(content)
        sessionMessageCount[sessionKey] = if (isLast) 0 else count + 1

        try {
            val resp = GptClient.chat(
                GptChatRequest(
                    message = content,
                    session_id = sessionKey,
                    is_first = isFirst,
                    is_last = isLast,
                )
            )
            message.channel.createMessage(resp.reply)
        } catch (e: Exception) {
            message.channel.createMessage(
                "Nie udalo sie polaczyc z asystentem AI: ${e.message}"
            )
        }
    }

    kord.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}
