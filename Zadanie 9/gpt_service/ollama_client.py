from __future__ import annotations

import os
import httpx

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

SYSTEM_PROMPT = (
    "Jestes uprzejmym asystentem sklepu internetowego z ubraniami. "
    "Pomagasz klientom w doborze odziezy, informujesz o rozmiarach, "
    "kolorach, materialach, cenach, dostawie i zamowieniach. "
    "Odpowiadaj WYLACZNIE na pytania zwiazane ze sklepem odziezowym. "
    "Jezeli pytanie dotyczy innego tematu (polityka, religia, inne sklepy, "
    "programowanie, sport itp.) uprzejmie odmow i wroc do tematu ubran. "
    "Odpowiadaj krotko, po polsku, w pozytywnym i przyjaznym tonie. "
    "Nie wypisuj dlugich list - maksymalnie 3-4 zdania."
)


async def ask_ollama(user_message: str, timeout: float = 60.0) -> str:
    """Wysyla zapytanie do Ollamy i zwraca tresc odpowiedzi."""
    payload = {
        "model": OLLAMA_MODEL,
        "stream": False,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        "options": {
            "temperature": 0.7,
            "num_predict": 256,
        },
    }
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(f"{OLLAMA_URL}/api/chat", json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data.get("message", {}).get("content", "").strip()
