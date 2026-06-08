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

[commit 1](https://github.com/misiuleczek02/Ebiznes/commit/a264077fedf98d668c2b60d1067513b4297b6321)

# Zadanie 2 Scala
✅ 1. - Należy stworzyć kontroler do Produktów

✅ 2. - Do kontrolera należy stworzyć endpointy zgodnie z CRUD - dane pobierane z listy

✅ 3. - Należy stworzyć kontrolery do Kategorii oraz Koszyka + endpointy zgodnie z CRUD

✅ 4. - Należy aplikację uruchomić na dockerze (stworzyć obraz) oraz dodać skrypt uruchamiający aplikację via ngrok

✅ 5. - Należy dodać konfigurację CORS dla dwóch hostów dla metod CRUD

[commit 2](https://github.com/misiuleczek02/Ebiznes/commit/de0fbbdbadacbadfe805690b0b602a28544347b8)

# Zadanie 3 Kotlin
✅ 1. -  Należy stworzyć aplikację kliencką w Kotlinie we frameworku Ktor, która pozwala na przesyłanie wiadomości na platformę Discord

✅ 2. -  Aplikacja jest w stanie odbierać wiadomości użytkowników z platformy Discord skierowane do aplikacji (bota)

✅ 3. -  Zwróci listę kategorii na określone żądanie użytkownika

✅ 4. -  Zwróci listę produktów wg żądanej kategorii

✅ 5. -  Aplikacja obsłuży dodatkowo jedną z platform: Slack lub Messenger

[commit 3](https://github.com/misiuleczek02/Ebiznes/commit/2f3f5b976d29b1853eb36f4fa8768a5a33c0a766)

# Zadanie 4 Go

✅ 1. - Należy stworzyć aplikację we frameworki echo w j. Go, która będzie miała kontroler Produktów zgodny z CRUD

✅ 2. - Należy stworzyć model Produktów wykorzystując gorm oraz wykorzystać model do obsługi produktów (CRUD) w kontrolerze (zamiast listy)

✅ 3. - Należy dodać model Koszyka oraz dodać odpowiedni endpoint

✅ 4. - Należy stworzyć model kategorii i dodać relację między kategorią, a produktem

✅ 5. - pogrupować zapytania w gorm’owe scope'y

[commit 4](https://github.com/misiuleczek02/Ebiznes/commit/c8065c384d519c0087c8196657a10aa44ab2f5f1)

# Zadanie 5 Frontend

✅ 1. - W ramach projektu należy stworzyć dwa komponenty: Produkty oraz Płatności; Płatności powinny wysyłać do aplikacji serwerowej dane, a w Produktach powinniśmy pobierać dane o produktach z aplikacji serwerowej;

✅ 2. - Należy dodać Koszyk wraz z widokiem; należy wykorzystać routing

✅ 3. -  Dane pomiędzy wszystkimi komponentami powinny być przesyłane za pomocą React hooks

✅ 4. - Należy dodać skrypt uruchamiający aplikację serwerową oraz kliencką na dockerze via docker-compose

✅ 5. -  Należy wykorzystać axios’a oraz dodać nagłówki pod CORS

[commit 5](https://github.com/misiuleczek02/Ebiznes/commit/fc3dec7abbfe02c8fd3c6af2842f4e3857922eca)

# Zadanie 6 Testy

✅ 1. -  Należy stworzyć 20 przypadków testowych w CypressJS lub Selenium (Kotlin, Python, Java, JS, Go, Scala)

✅ 2. -  Należy rozszerzyć testy funkcjonalne, aby zawierały minimum 50 asercji

✅ 3. Należy stworzyć testy jednostkowe do wybranego wcześniejszego projektu z minimum 50 asercjami

✅ 4. Należy dodać testy API, należy pokryć wszystkie endpointy z minimum jednym scenariuszem negatywnym per endpoint

✅ 5. Należy uruchomić testy funkcjonalne na Browserstacku

[commit 6](https://github.com/misiuleczek02/Ebiznes/commit/49973bfa590ef6b01f1e4101554e3dd724b71a94)

# Zadanie 7 

Repozytoria zadanie7-client i zadanie7-server

# Zadanie 8 Klient Oauth2

✅ 1. - logowanie przez aplikację serwerową (bez Oauth2)

✅ 2. - rejestracja przez aplikację serwerową (bez Oauth2)

✅ 3. - logowanie via Google OAuth2

✅ 4. -  logowanie via Facebook lub Github OAuth2

✅ 5. -  zapisywanie danych logowania OAuth2 po stronie serwera

[commit 8](https://github.com/misiuleczek02/Ebiznes/commit/c849e8a7849cb39af817d0e2070c2c1969457657)

# Zadanie 9 Rozszerzenie funkcjonalności bota o GPT

✅ 1. - należy stworzyć po stronie serwerowej osobny serwis do łącznia z chatGPT

✅ 2. - należy połączyć serwis z interfejsem frontendowym via serwis w Kotlinie (zadanie 3) - discord + JS

✅ 3. - stworzyć listę 5 różnych otwarć oraz zamknięć rozmowy

✅ 4. - filtrowanie po zagadnieniach związanych ze sklepem (np. ograniczenie się jedynie do ubrań oraz samego sklepu) do GPT

✅ 5. - filtrowanie odpowiedzi po sentymencie

# Zadanie 10

✅ 3.0 - Należy stworzyć odpowiednie instancje po stronie chmury na dockerze
