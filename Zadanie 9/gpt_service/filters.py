"""Filtry: tematyczny (sklep odziezowy) oraz sentymentu odpowiedzi."""
from __future__ import annotations

SHOP_KEYWORDS = {
    "ubran", "ubrani", "odziez", "odzież",
    "koszul", "spodni", "sukienk", "sukni", "bluzk", "bluz", "spodnic",
    "sweter", "sweterek", "kurtk", "plaszcz", "płaszcz",
    "buty", "butów", "obuwie", "trampki", "sneakers", "adidas",
    "skarpet", "bielizn", "majtk", "stanik", "biustonosz",
    "szalik", "czapk", "rekawicz", "rękawiczk",
    "rozmiar", "kolor", "material", "materiał", "bawełn", "bawelna",
    "polyester", "poliester", "wełn", "welna", "skor", "skór",
    "cena", "ceny", "promoc", "wyprzeda", "rabat", "znizk", "zniżk",
    "sklep", "zamówienie", "zamowienie", "dostawa", "wysylk", "wysyłk",
    "zwrot", "reklamacj", "platnos", "płatnoś",
    "produkt", "asortyment", "ofert", "kategor", "moda",
    "kolekcj", "sezon", "letni", "zimow", "wiosenn", "jesienn",
    "damsk", "mesk", "męsk", "dzieci", "dzieck",
    "jeans", "jeansy", "dzins", "dżins",
    "hello", "hi", "czesc", "cześć", "witaj", "dzien dobry", "dzień dobry",
    "siema", "hej",
}

POSITIVE_WORDS = {
    "swietn", "świetn", "super", "wspanial", "fantastyczn", "doskonal", "doskonał",
    "polecam", "ciekawy", "ciekawa", "ciekawe", "milo", "miło", "dziek", "dzięk",
    "ciesze", "cieszę", "fajn", "udan", "milego", "miłego", "zapraszam", "chetnie",
    "chętnie", "pomogę", "pomoge", "tak", "oczywiscie", "oczywiście",
    "happy", "great", "nice", "good", "excellent", "love", "best",
}

NEGATIVE_WORDS = {
    "niestety", "nie moge", "nie mogę", "nie da sie", "nie da się",
    "zal", "żal", "przykro", "niemozliw", "niemożliw",
    "nie wiem", "brak", "nie posiadam", "nie ma",
    "zaden", "żaden", "nigdy", "niemoznosc", "niemożność",
    "trudno", "ciezko", "ciężko", "smutno", "porazk", "porażk",
    "sorry", "bad", "terrible", "awful", "hate", "worst", "cannot",
}


def is_on_topic(text: str) -> bool:
    """Zwraca True jezeli wiadomosc dotyczy sklepu odziezowego."""
    lowered = text.lower().strip()
    if not lowered:
        return False
    if len(lowered) < 5:
        return True
    return any(kw in lowered for kw in SHOP_KEYWORDS)


def off_topic_reply() -> str:
    return (
        "Jestem asystentem sklepu odziezowego i moge pomoc tylko w sprawach "
        "zwiazanych z naszym asortymentem - ubraniami, rozmiarami, cenami, "
        "dostawa i zamowieniami. Zapytaj o cos z oferty sklepu :)"
    )


def sentiment_score(text: str) -> int:
    """Prosty score: pozytywne slowa +1, negatywne -1. >=0 traktujemy jako akceptowalne."""
    lowered = text.lower()
    pos = sum(1 for w in POSITIVE_WORDS if w in lowered)
    neg = sum(1 for w in NEGATIVE_WORDS if w in lowered)
    return pos - neg


def is_negative(text: str) -> bool:
    return sentiment_score(text) < 0


def soften_negative(text: str) -> str:
    """Lagodzi negatywna odpowiedz dodajac pozytywne zamkniecie."""
    softened = text.strip()
    suffix = (
        " Postaram sie jednak znalezc dla Ciebie najlepsze rozwiazanie - "
        "powiedz prosze, czego dokladnie szukasz, a chetnie pomoge!"
    )
    return softened + suffix
