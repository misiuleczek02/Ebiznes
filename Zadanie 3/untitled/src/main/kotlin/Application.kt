import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.*
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.engine.cio.*
import io.ktor.http.*
import kotlinx.coroutines.launch

val client = HttpClient(CIO) {
    install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
        json()
    }
}

fun main() {
    val discordToken = System.getenv("DISCORD_TOKEN") ?: "MTQ5MzIxODgyOTYwODk0NzcyMg.GLWNGK.qmoXPY3SRzK28DLplV3nVqq7pbfphLQKE98rJc"
    val slackToken = System.getenv("SLACK_BOT_TOKEN") ?: "xoxb-10914266829441-10914265296257-qhXsLR0jpkv9FtY60wBlTQNe"

    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }

        launch { startDiscordBot(discordToken) }

        routing {
            post("/slack/events") {
                val payload = call.receive<JsonObject>()

                if (payload["type"]?.jsonPrimitive?.content == "url_verification") {
                    val challenge = payload["challenge"]?.jsonPrimitive?.content
                    call.respondText(challenge ?: "", ContentType.Text.Plain)
                    return@post
                }

                val event = payload["event"]?.jsonObject
                if (event?.get("type")?.jsonPrimitive?.content == "message" && event["bot_id"] == null) {
                    val text = event["text"]?.jsonPrimitive?.content ?: ""
                    val channel = event["channel"]?.jsonPrimitive?.content ?: ""

                    val reply = ShopService.processCommand(text)
                    if (reply != null) {
                        sendSlackMessage(slackToken, channel, reply)
                    }
                }
                call.respond(HttpStatusCode.OK)
            }
        }
    }.start(wait = true)
}

suspend fun sendSlackMessage(token: String, channel: String, text: String) {
    client.post("https://slack.com/api/chat.postMessage") {
        header(HttpHeaders.Authorization, "Bearer $token")
        contentType(ContentType.Application.Json)
        setBody(buildJsonObject {
            put("channel", channel)
            put("text", text)
        })
    }
}