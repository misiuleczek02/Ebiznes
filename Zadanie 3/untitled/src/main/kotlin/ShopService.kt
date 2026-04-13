object ShopService {
    private val categories = listOf("Elektronika", "Książki", "Narzędzia")
    private val products = mapOf(
        "Elektronika" to listOf("Laptop", "Smartfon", "Słuchawki"),
        "Książki" to listOf("Władca Pierścieni", "Diuna", "Czysty Kod"),
        "Narzędzia" to listOf("Wiertarka", "Młotek")
    )

    fun getCategories(): String {
        return "Dostępne kategorie: ${categories.joinToString(", ")}"
    }

    fun getProducts(category: String): String {
        val foundCategory = categories.find { it.equals(category, ignoreCase = true) }
            ?: return "Nie znaleziono kategorii: $category"

        val items = products[foundCategory] ?: emptyList()
        return "Produkty w kategorii $foundCategory: ${items.joinToString(", ")}"
    }

    fun processCommand(command: String): String? {
        val parts = command.trim().split(" ")
        return when (parts[0].lowercase()) {
            "!kategorie" -> getCategories()
            "!produkty" -> {
                if (parts.size > 1) getProducts(parts[1])
                else "Podaj kategorię, np. !produkty Elektronika"
            }
            else -> null
        }
    }
}