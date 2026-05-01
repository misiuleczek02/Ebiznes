# Ebiznes
Zadania na zajęcia z ebiznesu 2026
Oliwia Majewska

# Zadanie 1 Docker
✅ 1. - obraz ubuntu z Pythonem w wersji 3.10

✅ 2. - obraz ubuntu:24.02 z Javą w wersji 8 oraz Kotlinem

✅ 3. - do powyższego należy dodać najnowszego Gradle’a oraz paczkę JDBC SQLite w ramach projektu na Gradle (build.gradle)

✅ 4. - stworzyć przykład typu HelloWorld oraz uruchomienie aplikacji przez CMD oraz gradle

✅ 5. - dodać konfigurację docker-compose

link do obrazu na docker hub: https://hub.docker.com/repository/docker/misiuleczek02/zadanie-docker/general

# Zadanie 2 Scala
✅ 1. - Należy stworzyć kontroler do Produktów

✅ 2. - Do kontrolera należy stworzyć endpointy zgodnie z CRUD - dane pobierane z listy

✅ 3. - Należy stworzyć kontrolery do Kategorii oraz Koszyka + endpointy zgodnie z CRUD

✅ 4. - Należy aplikację uruchomić na dockerze (stworzyć obraz) oraz dodać skrypt uruchamiający aplikację via ngrok

✅ 5. - Należy dodać konfigurację CORS dla dwóch hostów dla metod CRUD

aby uruchomić aplikację:

   docker build -t scala-sklep-api .

   ./start.sh

# Zadanie 3 Kotlin
✅ 1. -  Należy stworzyć aplikację kliencką w Kotlinie we frameworku Ktor, która pozwala na przesyłanie wiadomości na platformę Discord

✅ 2. -  Aplikacja jest w stanie odbierać wiadomości użytkowników z platformy Discord skierowane do aplikacji (bota)

✅ 3. -  Zwróci listę kategorii na określone żądanie użytkownika

✅ 4. -  Zwróci listę produktów wg żądanej kategorii

✅ 5. -  Aplikacja obsłuży dodatkowo jedną z platform: Slack lub Messenger

# Zadanie 4 Go

✅ 1. - Należy stworzyć aplikację we frameworki echo w j. Go, która będzie miała kontroler Produktów zgodny z CRUD

✅ 2. - Należy stworzyć model Produktów wykorzystując gorm oraz wykorzystać model do obsługi produktów (CRUD) w kontrolerze (zamiast listy)

✅ 3. - Należy dodać model Koszyka oraz dodać odpowiedni endpoint

✅ 4. - Należy stworzyć model kategorii i dodać relację między kategorią, a produktem

✅ 5. - pogrupować zapytania w gorm’owe scope'y

# Zadanie 5 Frontend

✅ 1. - W ramach projektu należy stworzyć dwa komponenty: Produkty oraz Płatności; Płatności powinny wysyłać do aplikacji serwerowej dane, a w Produktach powinniśmy pobierać dane o produktach z aplikacji serwerowej;

✅ 2. - Należy dodać Koszyk wraz z widokiem; należy wykorzystać routing

✅ 3. -  Dane pomiędzy wszystkimi komponentami powinny być przesyłane za pomocą React hooks

✅ 4. - Należy dodać skrypt uruchamiający aplikację serwerową oraz kliencką na dockerze via docker-compose

✅ 5. -  Należy wykorzystać axios’a oraz dodać nagłówki pod CORS

# Zadanie 6 Testy

✅ 1. -  Należy stworzyć 20 przypadków testowych w CypressJS lub Selenium (Kotlin, Python, Java, JS, Go, Scala)

✅ 2. -  Należy rozszerzyć testy funkcjonalne, aby zawierały minimum 50 asercji

✅ 3. Należy stworzyć testy jednostkowe do wybranego wcześniejszego projektu z minimum 50 asercjami

✅ 4. Należy dodać testy API, należy pokryć wszystkie endpointy z minimum jednym scenariuszem negatywnym per endpoint

✅ 5. Należy uruchomić testy funkcjonalne na Browserstacku