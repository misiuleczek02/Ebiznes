# Zadanie 10 - CI/CD

## 3.0 - instancje po stronie chmury na Dockerze

Zrobiłam prostą aplikację sklepu, która składa się z dwóch części:
- **serwer** w Go - wystawia API z produktami,
- **klient** w React - pobiera te produkty z serwera i je wyświetla.

Obie odpalają się jako osobne kontenery Dockera, spięte przez `docker-compose`,
i rozmawiają ze sobą (klient woła API serwera, serwer ma ustawiony CORS).

## Jak odpalić

```bash
cd "Zadanie 10"
docker compose up --build
```

Potem wchodzę w przeglądarce na:
- klient: http://localhost:3000
- serwer: http://localhost:8080/api/products

Żeby zatrzymać:

```bash
docker compose down
```

## Co jest w środku

```
server/   - API w Go (net/http) + Dockerfile
client/   - aplikacja React + Dockerfile (build i nginx)
docker-compose.yml - odpala oba kontenery naraz
```

## Endpointy serwera

- `GET /api/products` - lista produktów
- `GET /api/products?category=Ubrania` - produkty z danej kategorii
- `GET /api/products/{id}` - jeden produkt (albo 404)
- `GET /api/categories` - lista kategorii
- `GET /api/health` - sprawdzenie czy serwer żyje