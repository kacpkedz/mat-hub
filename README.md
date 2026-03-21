# Math Arcade PWA

Gra matematyczna na refleks — działania arytmetyczne i rozkład wielomianów kwadratowych.

## Uruchomienie lokalnie

```bash
# Python (najprostsze)
python3 -m http.server 8080
# następnie otwórz http://localhost:8080

# Node.js
npx serve .
```

## Publikacja na GitHub Pages

1. Utwórz nowe repozytorium na GitHub (np. `math-arcade`)
2. Wrzuć zawartość tego folderu:
   ```bash
   git init
   git add .
   git commit -m "init: Math Arcade PWA"
   git remote add origin https://github.com/TWÓJ_LOGIN/math-arcade.git
   git push -u origin main
   ```
3. W ustawieniach repo → **Pages** → Source: `main` / `/ (root)`
4. Po chwili gra dostępna pod `https://TWÓJ_LOGIN.github.io/math-arcade/`
5. Na telefonie otwórz URL → **Dodaj do ekranu głównego** → działa offline ✓

## Struktura

```
index.html      — cała gra (jeden plik)
manifest.json   — konfiguracja PWA
sw.js           — service worker (cache offline)
icons/
  icon-192.png
  icon-512.png
```

## Poziomy trudności

| Poziom  | Arytmetyka     | Kwadratowe (coef) | Znaki pierwiastków |
|---------|---------------|-------------------|-------------------|
| Łatwy   | liczby 1–12   | x²  (1)           | losowe +/−        |
| Średni  | liczby 1–20   | x², 2x², 3x²      | losowe +/−        |
| Trudny  | liczby 1–30   | x², 2x², 3x², 5x² | losowe +/−, (x±r)²|

## Punktacja

- Działanie arytmetyczne: **10 pkt** × mnożnik combo
- Rozkład kwadratowy: **20 pkt** × mnożnik combo
- Co 5 poprawnych z rzędu: mnożnik rośnie o 1 (×2, ×3, ...)
