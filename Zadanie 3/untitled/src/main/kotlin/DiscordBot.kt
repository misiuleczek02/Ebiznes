import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent

suspend fun startDiscordBot(token: String) {
    val kord = Kord(token)

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot == true) return@on

        val content = message.content

        val reply = ShopService.processCommand(content)

        if (reply != null) {
            message.channel.createMessage(reply)
        }
    }

    kord.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}