"""Otwarcia i zamkniecia rozmowy - po 5 wariantow."""
import random

OPENINGS = [
    "Czesc! Witam w naszym sklepie odziezowym. W czym moge pomoc?",
    "Dzien dobry! Milo Cie goscic. Szukasz czegos konkretnego z naszej oferty ubran?",
    "Witaj! Jestem tutaj, zeby pomoc Ci znalezc idealne ubranie. Co Cie interesuje?",
    "Hej! Ciesze sie, ze odwiedziles nasz sklep odziezowy. Czego potrzebujesz?",
    "Serdecznie witam! Nasz sklep oferuje szeroki wybor ubran. Jak moge pomoc?",
]

CLOSINGS = [
    "Dziekuje za rozmowe. Milego dnia i do zobaczenia w sklepie!",
    "Zycze udanych zakupow. Wracaj do nas niedlugo!",
    "Dzieki za zainteresowanie nasza oferta. Zapraszamy ponownie!",
    "Bylo mi milo. Powodzenia z zakupami!",
    "Do zobaczenia! Pamietaj, ze zawsze sluzymy pomoca w doborze ubran.",
]

GOODBYE_KEYWORDS = {
    "do widzenia", "do zobaczenia", "papa", "pa", "zegnaj", "narazie",
    "na razie", "dziekuje za rozmowe", "dzieki za pomoc", "koniec",
    "bye", "goodbye", "cya", "thanks bye",
}


def random_opening() -> str:
    return random.choice(OPENINGS)


def random_closing() -> str:
    return random.choice(CLOSINGS)


def is_goodbye(text: str) -> bool:
    lowered = text.lower().strip()
    return any(kw in lowered for kw in GOODBYE_KEYWORDS)
