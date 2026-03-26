// ===========================================
// KONFIGURACJA POZIOMÓW TRUDNOŚCI
// ===========================================
// Konfiguracja wartości używanych na danym poziomie trudności

const POZIOMY = {
  latwy: {
    dzialanieMax: 12,      // Maksymalna liczba w dodawaniu/odejmowaniu
    mnozeniMax:   10,      // Maksymalna liczba w mnożeniu
    dzielenieMax: 10,      // Maksymalny dzielnik/wynik w dzieleniu
    rozkladMax:   7,       // Maksymalny pierwiastek w rozkładzie
    wspolczynniki: [1],    // Tylko x² (brak 2x², 3x²)
    ujemneRzerwiastki: false, // Brak ujemnych pierwiastków
    podwojnyPierwiastek: false, // Brak (x-a)²
    wzoryMax:     7,       // Maksymalne 'b' we wzorach skróconego mnożenia
    pitagorasMax: 15,      // Maksymalna długość boku w twierdzeniu Pitagorasa
  },
  sredni: {
    dzialanieMax: 20,
    mnozeniMax:   12,
    dzielenieMax: 12,
    rozkladMax:   10,
    wspolczynniki: [1, 2, 3],
    ujemneRzerwiastki: true,
    podwojnyPierwiastek: false,
    wzoryMax:     9,
    pitagorasMax: 25,
  },
  trudny: {
    dzialanieMax: 30,
    mnozeniMax:   15,
    dzielenieMax: 15,
    rozkladMax:   12,
    wspolczynniki: [1, 2, 3, 5],
    ujemneRzerwiastki: true,
    podwojnyPierwiastek: true,
    wzoryMax:     9,
    pitagorasMax: 40,
  },
};

// ===========================================
// STAN GRY
// ===========================================
// Główny obiekt przechowujący logikę aktualnej rozgrywki

const stan = {
  // Postęp sesji
  punkty:      0,
  streak:      0,   // Ilość poprawnych odpowiedzi z rzędu
  maxStreak:   0,   // Najwyższy kombos
  poprawne:    0,
  bledne:      0,
  mnoznikKombo: 1,  // ×1, ×2, ×3... rośnie co 5 poprawnych

  // Ustawienia menu
  poziom:      'latwy',
  aktywneOperatory: ['+', '−', '×', '÷'],
  aktywneTypy:      ['dzialania', 'rozklad', 'wzory', 'pitagoras'],

  // Aktualne Pytanie
  trybGry:   'dzialania', // Wylosowany tryb
  pytanie:   null,        // Dane pytania po wylosowaniu
  gra:       false,       // Flaga aktywności gry

  // Miejsce na wpisywane wartości przez użytkownika
  buforJeden:  '',            // Wykorzystywane przez klawiaturę 1-polową (działania)
  buforDwa:    ['', ''],      // Wykorzystywane przez klawiaturę 2-polową (rozkład, pitagoras)
  aktywnePoleDwa: 0,          // Zaznaczony input 2-polowy
  buforTrzy:   ['', '', ''],  // Wykorzystywane przez klawiaturę 3-polową (wzory)
  aktywnePoleTrzy: 0,         // Zaznaczony input 3-polowy
};
