import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class GptChatRequest(
    val message: String,
    val session_id: String? = null,
    val is_first: Boolean = false,
    val is_last: Boolean = false,
)

@Serializable
data class GptChatResponse(
    val reply: String,
    val on_topic: Boolean = true,
    val sentiment: Int = 0,
    val softened: Boolean = false,
    val used_opening: String? = null,
    val used_closing: String? = null,
    val model: String = "",
)

object GptClient {
    private val baseUrl: String = System.getenv("GPT_SERVICE_URL") ?: "http://localhost:8000"

    private val http = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
        install(HttpTimeout) {
            requestTimeoutMillis = 90_000
            connectTimeoutMillis = 10_000
            socketTimeoutMillis = 90_000
        }
    }

    suspend fun chat(req: GptChatRequest): GptChatResponse {
        val resp = http.post("$baseUrl/chat") {
            contentType(ContentType.Application.Json)
            setBody(req)
        }
        return resp.body()
    }
}
