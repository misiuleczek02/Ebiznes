import java.sql.DriverManager

fun main() {
    println("Hello World z kotlina w dockerze")
    
    try {
        val connection = DriverManager.getConnection("jdbc:sqlite:test.db")
        println("Sukces: Połączono z bazą SQLite: ${connection.metaData.databaseProductName}")
        connection.close()
    } catch (e: Exception) {
        println("Błąd połączenia z bazą: ${e.message}")
    }
}