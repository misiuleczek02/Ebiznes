# Zadanie 9

Rozszerzenie bota z Zadania 3 o własny serwis GPT i frontend. Serwis odpala lokalny model przez Ollamę.

## Co jest w środku

```
gpt_service/   <- FastAPI + Ollama
frontend/      <- Flask + JS, prosty chat w przeglądarce
```

Dodatkowo modyfikacje w `Zadanie 3/untitled/src/main/kotlin/`:
- `GptClient.kt` – nowy plik, klient HTTP do gpt_service
- `DiscordBot.kt`, `Application.kt` – dorzucone wywołania do GPT dla wiadomości, które nie są komendami `!kategorie` / `!produkty`

## Punkty

| Pkt | Co miało być | Gdzie to siedzi |
|-----|-----|-----|
| 3.0 | Osobny serwis do GPT | `gpt_service/main.py` (FastAPI), `ollama_client.py` |
| 3.5 | Połączenie przez Kotlin bota z Zadania 3 | `GptClient.kt` + zmiany w `DiscordBot.kt` i `Application.kt` |
| 4.0 | 5 otwarć i 5 zamknięć | `conversation.py` – listy `OPENINGS` i `CLOSINGS`, losowane |
| 4.5 | Filtr po temacie sklepu | `filters.py::is_on_topic` (słowa kluczowe) + system prompt w `ollama_client.py` |
| 5.0 | Filtr sentymentu | `filters.py::sentiment_score` + `soften_negative` |

## Jak to ze sobą gada

```
przeglądarka  ──►  frontend (Flask, :5000)  ──►  gpt_service (FastAPI, :8000)  ──►  Ollama (:11434)
Discord/Slack ──►  Kotlin bot (Zadanie 3)   ──►  gpt_service ────────────────────┘
```

Frontend nie woła Ollamy bezpośrednio – wszystko leci przez gpt_service, żeby filtry były w jednym miejscu (i żeby bot z Zadania 3 miał ten sam pipeline).

## Odpalanie

Najprościej 3 terminale.

### Terminal 1 – Ollama

Jak zainstalowana to chodzi w tle (ikonka w trayu). Można sprawdzić:
```powershell
curl http://localhost:11434/api/tags
```
Powinno coś zwrócić, niekoniecznie pusto – jak pusto to `ollama pull llama3.2`.

### Terminal 2 – gpt_service

```powershell
cd "Zadanie 9\gpt_service"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Słucha na `http://localhost:8000`

Zmienne środowiskowe (opcjonalne):
- `OLLAMA_URL` – domyślnie `http://localhost:11434`
- `OLLAMA_MODEL` – domyślnie `llama3.2`

### Terminal 3 – frontend

```powershell
cd "Zadanie 9\frontend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Wchodzisz na `http://localhost:5000` i piszesz w okienko.

## Endpointy gpt_service

- `GET  /health` – sanity check
- `GET  /openings` – wszystkie 5 powitań
- `GET  /closings` – wszystkie 5 pożegnań
- `POST /chat` – właściwa rozmowa

Przykład:
```powershell
$body = '{"message":"Szukam czarnej koszuli rozmiar L","is_first":true}'
curl -Method POST http://localhost:8000/chat -ContentType "application/json" -Body $body
```

W odpowiedzi dostajesz nie tylko `reply`, ale też `on_topic`, `sentiment`, `softened` – widać czy filtry coś zrobiły. We frontendzie to leci jako mały tag pod wiadomością.

## Jak działają filtry

**Temat (4.5).** Pierwsza linia obrony to lista słów w `SHOP_KEYWORDS` w `filters.py` – jak nic nie pasuje, wiadomość nawet nie idzie do modelu, tylko odsyłana jest odmowa. Druga linia – `SYSTEM_PROMPT` w `ollama_client.py` mówi modelowi wprost, że ma się trzymać sklepu odzieżowego.

**Sentyment (5.0).** Po odpowiedzi modelu liczę różnicę: pozytywne słowa minus negatywne (z list w `filters.py`). Jak wyjdzie ujemnie, doklejam pozytywne zakończenie (`soften_negative`). Nie jest to ML, jest to prostsze, ale w 90% przypadków wystarcza.

**Otwarcia/zamknięcia (4.0).** Frontend liczy ile wiadomości było w sesji (Flask session). Pierwsza dostaje losowe powitanie sklejone z odpowiedzią. Pożegnanie jak klikniesz przycisk "Zakończ" albo napiszesz coś typu "do widzenia" / "pa" (lista w `conversation.py`). Listy są po polsku, 5 wariantów każda.