# Zadanie 8 - OAuth2

## Architektura

```
React (klient)
   │
   │  axios POST /auth/login, /auth/register  (3.0/3.5)
   │  window.location -> GET /auth/google     (4.0)
   │
   ▼
Go + Echo (serwer)
   │
   │  redirect 302 -> Google / GitHub
   ▼
Dostawca OAuth2 (Google / GitHub)
   │
   │  redirect 302 -> /auth/{provider}/callback?code=...
   ▼
Go (serwer)
   - wymienia `code` na token dostawcy
   - pobiera profil użytkownika
   - zapisuje w DB usera + token dostawcy (5.0)
   - generuje **własny** JWT
   - redirect 302 -> http://localhost:3000/oauth-success?token=<JWT>
   ▼
React
   - zapisuje JWT w localStorage
   - przesyła `Authorization: Bearer <JWT>` w nagłówku do `/api/me`
```

Wymóg "react-serwer-dostawca-serwer(via return uri)-react" jest spełniony: klient React **nie tworzy żadnych klientów OAuth bezpośrednio** - tylko przekierowuje przez serwer.

## Stack

- Backend: Go 1.22, Echo v4, GORM, SQLite, `golang.org/x/oauth2`, JWT (HS256), bcrypt
- Frontend: React 18, React Router 6, axios
- Docker: docker-compose dla obu serwisów

## Endpointy serwera

| Metoda | Ścieżka | Opis |
|---|---|---|
| POST | `/auth/register` | rejestracja (email, username, password) |
| POST | `/auth/login` | logowanie (email, password) |
| GET | `/auth/google` | start OAuth2 Google (redirect) |
| GET | `/auth/google/callback` | return URI dla Google |
| GET | `/auth/github` | start OAuth2 GitHub (redirect) |
| GET | `/auth/github/callback` | return URI dla GitHub |
| GET | `/api/me` | dane zalogowanego (chroniony JWT serwera) |

> Podpunkt 4.5 dopuszcza Facebook **lub** GitHub. Tutaj jest GitHub (prostsza rejestracja aplikacji, ten sam mechanizm OAuth2).

## Uruchomienie via docker-compose

```bash
# w root Zadania 8
GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... \
GITHUB_CLIENT_ID=... GITHUB_CLIENT_SECRET=... \
docker compose up --build
```

lub stwórz plik `.env` w root z tymi zmiennymi i `docker compose up --build`.

## Co jest w bazie (5.0)

Tabela `users`:
- `email`, `username`, `avatar_url`
- `password_hash` (bcrypt) - tylko dla kont lokalnych
- `provider` - `local` / `google` / `github`
- `provider_user_id` - id w systemie dostawcy
- `provider_token`, `provider_refresh`, `provider_expires_at` - **token od dostawcy** przechowywany po stronie serwera (5.0)

Klient nigdy nie dostaje tokenu od Google/GitHub - dostaje wyłącznie JWT wygenerowany przez serwer.
