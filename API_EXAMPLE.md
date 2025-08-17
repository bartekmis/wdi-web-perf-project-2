# Jobs API - Dokumentacja

## Przegląd
Prosta dokumentacja API do zarządzania ofertami pracy.

## Endpoints

### Pobierz wszystkie oferty pracy

**Endpoint:** `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`

**Metoda:** `GET`

**Opis:** Pobiera listę ofert pracy. Domyślnie zwraca wszystkie dostępne oferty.

#### Parametry zapytania

| Parametr | Typ | Opis | Przykład |
|----------|-----|------|----------|
| `_limit` | number | Ogranicza liczbę zwróconych ofert | `?_limit=6` |
| `_start` | number | Pomija określoną liczbę ofert (paginacja) | `?_start=6` |
| `role` | string | Filtruje według stanowiska (case-insensitive) | `?role=frontend` |
| `location` | string | Filtruje według lokalizacji | `?location=warszawa` |
| `position` | string | Filtruje według poziomu (Junior, Mid, Senior) | `?position=senior` |

#### Przykłady użycia

```
GET /jobs
GET /jobs?_limit=10
GET /jobs?role=backend&location=kraków
GET /jobs?position=senior&_limit=5
```

---

### Pobierz pojedynczą ofertę pracy

**Endpoint:** `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/{id}`

**Metoda:** `GET`

**Opis:** Pobiera szczegóły jednej oferty pracy na podstawie ID.

#### Parametry ścieżki

| Parametr | Typ | Opis |
|----------|-----|------|
| `id` | string/number | Unikalny identyfikator oferty pracy |

#### Przykład użycia

```
GET /jobs/1
```