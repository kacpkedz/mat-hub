# mat-hub

aplikacja do ćwiczenia sprawności rachunkowej. działa offline jako PWA — można zainstalować na telefonie jak normalną apkę.

---

## tryby gry

### ± działania
klasyczne cztery działania arytmetyczne. wybierasz które chcesz ćwiczyć (dodawanie, odejmowanie, mnożenie, dzielenie) — możesz łączyć dowolnie. wynik wpisujesz na klawiaturze numerycznej.

| poziom | zakres liczb | co ciekawego |
|--------|-------------|--------------|
| łatwy | 1–12 (dodawanie/odejmowanie), 1–10 (mnożenie/dzielenie) | tylko wyniki dodatnie, proste liczby |
| średni | 1–20 / 1–12 | mogą się pojawić wyniki ujemne |
| trudny | 1–30 / 2–15 | większy zakres, bardziej złożone działania |

punkty: **10 pkt** za odpowiedź × mnożnik combo

---

### x² rozkład
dostajesz trójmian kwadratowy (np. `x² − 5x + 6 = 0`) i musisz znaleźć jego miejsca zerowe, czyli wpisać x₁ i x₂. kolejność nie ma znaczenia.

| poziom | zakres pierwiastków | co ciekawego |
|--------|---------------------|--------------|
| łatwy | 1–7 | tylko dodatnie pierwiastki, współczynnik a=1 |
| średni | 1–10, mogą ujemne | różne współczynniki a (1, 2, 3) |
| trudny | 1–12, mogą ujemne | a ∈ {1,2,3,5}, możliwy pierwiastek podwójny |

punkty: **20 pkt** za odpowiedź × mnożnik combo

---

### f(x) wzory
wzory skróconego mnożenia w dwóch kierunkach — albo *złóż* (podaj składniki z gotowego rozwinięcia) albo *rozpisz* (rozwiń podaną postać iloczynową). typy wzorów:

- `(ax+b)²` = a²x² + 2abx + b²
- `(ax−b)²` = a²x² − 2abx + b²
- `(ax+b)(ax−b)` = a²x² − b²
- `(x+b)³` = x³ + 3bx² + 3b²x + b³ *(tylko trudny)*

| poziom | zakres b | co ciekawego |
|--------|---------|--------------|
| łatwy | 2–7 | zawsze a=1, tylko złóż/rozpisz proste wzory |
| średni | 2–10 | a ∈ {1,2,3}, oba kierunki |
| trudny | 2–12 | a ∈ {1,2,3}, pojawia się wzór na sześcian |

punkty: **20 pkt** za odpowiedź × mnożnik combo

---

### △ pitagoras
rysunek trójkąta prostokątnego z dwoma znanymi bokami. wpisujesz trzeci brakujący bok. **zawsze liczby całkowite** — zadania generowane z prawdziwych trójek pitagorejskich.

konfiguracje:
- znane dwie przyprostokątne → szukasz przeciwprostokątnej (*c*)
- znana jedna przyprostokątna i przeciwprostokątna → szukasz drugiej przyprostokątnej (*a* lub *b*)

| poziom | trójki | skala |
|--------|--------|-------|
| łatwy | 3-4-5, 5-12-13, 8-15-17, 6-8-10 | ×1 |
| średni | szerszy zestaw | ×1 lub ×2 |
| trudny | pełny zestaw (np. 20-21-29, 9-40-41) | ×1 do ×3 |

punkty: **15 pkt** za odpowiedź × mnożnik combo

---

## system combo

za każde 5 poprawnych odpowiedzi z rzędu rośnie mnożnik punktów:

```
seria 0–4   → ×1
seria 5–9   → ×2
seria 10–14 → ×3
itd.
```

mnożnik widoczny na górze ekranu. jeśli nie odpowiesz przez 8 sekund — pasek wypada, seria się zeruje.

---

## struktura plików

```
mat-hub/
├── index.html      ← cała aplikacja (HTML + CSS + JS w jednym)
├── manifest.json   ← konfiguracja PWA
├── sw.js           ← service worker (offline)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## instalacja jako PWA

1. otwórz w Chrome / Safari na telefonie
2. "Dodaj do ekranu głównego" (Chrome: menu → Dodaj do ekranu głównego)
3. gotowe — działa offline

---

*mat-hub — ćwicz bo się nie nauczysz inaczej*
