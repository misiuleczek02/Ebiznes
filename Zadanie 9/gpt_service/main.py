"""GPT Service - FastAPI laczacy frontend / bota z Ollama.

Endpointy:
    GET  /health      - sprawdzenie zywotnosci
    POST /chat        - { message, session_id, is_first?, is_last? } -> { reply, ... }
    GET  /openings    - lista 5 otwarc
    GET  /closings    - lista 5 zamkniec
"""
from __future__ import annotations

import logging
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from conversation import (
    OPENINGS,
    CLOSINGS,
    random_opening,
    random_closing,
    is_goodbye,
)
from filters import (
    is_on_topic,
    off_topic_reply,
    is_negative,
    soften_negative,
    sentiment_score,
)
from ollama_client import ask_ollama, OLLAMA_MODEL

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("gpt_service")

app = FastAPI(title="Ebiznes GPT Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(..., description="Tresc wiadomosci od uzytkownika")
    session_id: Optional[str] = Field(default=None, description="ID sesji (do otwarc/zamkniec)")
    is_first: bool = Field(default=False, description="Czy to pierwsza wiadomosc w sesji")
    is_last: bool = Field(default=False, description="Czy to ostatnia wiadomosc w sesji")


class ChatResponse(BaseModel):
    reply: str
    on_topic: bool
    sentiment: int
    softened: bool
    used_opening: Optional[str] = None
    used_closing: Optional[str] = None
    model: str


@app.get("/health")
def health():
    return {"status": "ok", "model": OLLAMA_MODEL}


@app.get("/openings")
def get_openings():
    return {"openings": OPENINGS}


@app.get("/closings")
def get_closings():
    return {"closings": CLOSINGS}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    msg = (req.message or "").strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Pusta wiadomosc.")

    opening = random_opening() if req.is_first else None
    auto_goodbye = is_goodbye(msg)
    closing = random_closing() if (req.is_last or auto_goodbye) else None

    if not is_on_topic(msg):
        log.info("Off-topic message blocked: %r", msg)
        reply = off_topic_reply()
        return ChatResponse(
            reply=_compose(opening, reply, closing),
            on_topic=False,
            sentiment=sentiment_score(reply),
            softened=False,
            used_opening=opening,
            used_closing=closing,
            model=OLLAMA_MODEL,
        )

    try:
        raw_reply = await ask_ollama(msg)
    except Exception as exc:
        log.exception("Ollama call failed")
        raise HTTPException(status_code=502, detail=f"Blad komunikacji z Ollama: {exc}")

    if not raw_reply:
        raw_reply = "Przepraszam, nie udalo mi sie wygenerowac odpowiedzi. Sprobuj ponownie."

    softened = False
    final_reply = raw_reply
    if is_negative(raw_reply):
        log.info("Negative sentiment detected, softening reply.")
        final_reply = soften_negative(raw_reply)
        softened = True

    return ChatResponse(
        reply=_compose(opening, final_reply, closing),
        on_topic=True,
        sentiment=sentiment_score(final_reply),
        softened=softened,
        used_opening=opening,
        used_closing=closing,
        model=OLLAMA_MODEL,
    )


def _compose(opening: Optional[str], body: str, closing: Optional[str]) -> str:
    parts = []
    if opening:
        parts.append(opening)
    parts.append(body)
    if closing:
        parts.append(closing)
    return "\n\n".join(p for p in parts if p)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
