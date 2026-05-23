const chatEl = document.getElementById("chat");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("user-input");
const sendBtn = formEl.querySelector("button[type=submit]");
const resetBtn = document.getElementById("reset-btn");
const endBtn = document.getElementById("end-btn");

function append(role, text, meta) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  if (meta) {
    const m = document.createElement("div");
    m.className = "meta";
    m.textContent = meta;
    div.appendChild(m);
  }
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function appendSystem(text) {
  const div = document.createElement("div");
  div.className = "msg system";
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

async function send(message, { isLast = false } = {}) {
  append("user", message);
  inputEl.value = "";
  sendBtn.disabled = true;

  try {
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, is_last: isLast }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      append("bot", `Blad: ${data.error || resp.statusText}`);
      return;
    }
    const tags = [];
    if (!data.on_topic) tags.push("off-topic");
    if (data.softened) tags.push("sentyment: zlagodzony");
    if (data.used_opening) tags.push("opening");
    if (data.used_closing) tags.push("closing");
    const meta = tags.length ? `[${tags.join(" | ")}]` : "";
    append("bot", data.reply, meta);
  } catch (err) {
    append("bot", `Blad polaczenia: ${err.message}`);
  } finally {
    sendBtn.disabled = false;
    inputEl.focus();
  }
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = inputEl.value.trim();
  if (!msg) return;
  send(msg);
});

endBtn.addEventListener("click", () => {
  const msg = inputEl.value.trim() || "do widzenia";
  send(msg, { isLast: true });
});

resetBtn.addEventListener("click", async () => {
  await fetch("/api/reset", { method: "POST" });
  chatEl.innerHTML = "";
  appendSystem("Rozpoczeto nowa rozmowe.");
  inputEl.focus();
});

appendSystem("Napisz wiadomosc, zeby rozpoczac rozmowe.");
