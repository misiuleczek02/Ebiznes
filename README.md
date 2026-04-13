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