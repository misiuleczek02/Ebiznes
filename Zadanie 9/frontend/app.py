"""Frontend chatu w Pythonie - Flask + JS.

Serwuje pojedyncza strone HTML oraz proxy do gpt_service.
"""
from __future__ import annotations

import os
import uuid
import requests
from flask import Flask, jsonify, render_template, request, session

GPT_SERVICE_URL = os.getenv("GPT_SERVICE_URL", "http://localhost:8000")

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "ebiznes-zadanie-9-secret")


@app.route("/")
def index():
    if "session_id" not in session:
        session["session_id"] = str(uuid.uuid4())
        session["message_count"] = 0
    return render_template("index.html")


@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    msg = (data.get("message") or "").strip()
    is_last = bool(data.get("is_last", False))

    if not msg:
        return jsonify({"error": "Pusta wiadomosc."}), 400

    count = int(session.get("message_count", 0))
    is_first = count == 0
    session["message_count"] = count + 1

    payload = {
        "message": msg,
        "session_id": session.get("session_id"),
        "is_first": is_first,
        "is_last": is_last,
    }

    try:
        resp = requests.post(
            f"{GPT_SERVICE_URL}/chat",
            json=payload,
            timeout=90,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        return jsonify({"error": f"Blad polaczenia z gpt_service: {exc}"}), 502

    return jsonify(resp.json())


@app.post("/api/reset")
def reset():
    session["session_id"] = str(uuid.uuid4())
    session["message_count"] = 0
    return jsonify({"ok": True, "session_id": session["session_id"]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
