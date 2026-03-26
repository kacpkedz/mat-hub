// ===========================================
// TRYB 1: DZIAŁANIA ARYTMETYCZNE
// ===========================================
// Gracz rozwiązuje wylosowane równanie i wpisuje jedną wartość do pola wyniku

function generujDzialanie() {
  const cfg = POZIOMY[stan.poziom];
  const ops = stan.aktywneOperatory.length ? stan.aktywneOperatory : ['+'];
  const operator = losujZ(ops);

  let a, b, odpowiedz;

  if (operator === '+') {
    a = losuj(1, cfg.dzialanieMax);
    b = losuj(1, cfg.dzialanieMax);
    odpowiedz = a + b;
  } else if (operator === '−') {
    a = losuj(1, cfg.dzialanieMax);
    b = losuj(1, cfg.dzialanieMax);
    if (b > a) [a, b] = [b, a]; // Ochrona przed wynikiem ujemnym
    odpowiedz = a - b;
  } else if (operator === '×') {
    a = losuj(1, cfg.mnozeniMax);
    b = losuj(1, cfg.mnozeniMax);
    odpowiedz = a * b;
  } else {
    // Dzielenie — tworzymy poprzez mnożenie (zawsze wynik całkowity)
    b = losuj(2, cfg.dzielenieMax);
    odpowiedz = losuj(1, cfg.dzielenieMax);
    a = b * odpowiedz;
  }

  stan.pytanie = { odpowiedz };
  stan.buforJeden = '';

  const nazwyOperatorow = { '+': 'Dodawanie', '−': 'Odejmowanie', '×': 'Mnożenie', '÷': 'Dzielenie' };
  etykietaPytania.textContent = nazwyOperatorow[operator];

  // Widok pustego pytania ze znakiem ? oczekującym na akcję
  el('pytanieArytm').innerHTML =
    `${a}<span class="operator"> ${operator} </span>${b}` +
    `<span class="rowna-sie"> = </span>` +
    `<span id="odp">?</span>`;
}

// Aktualizacja wprowadzanego pytania na żywo
function odswiezOdpowiedzArytm() {
  const odp = el('odp');
  if (!odp) return;
  odp.textContent = stan.buforJeden || '?';
  odp.className = stan.buforJeden;
}

// Weryfikacja działania wpisanego przez klawiaturę
function sprawdzDzialanie() {
  const wpisane = parseInt(stan.buforJeden);
  if (isNaN(wpisane) || stan.buforJeden === '' || stan.buforJeden === '-') return;

  if (wpisane === stan.pytanie.odpowiedz) {
    trafiony();
  } else {
    bledny();
    // Pokazuje poprawną odpowiedź zamiast ? po stłumionej porażce
    const odp = el('odp');
    if (odp) { odp.textContent = stan.pytanie.odpowiedz; odp.className = 'odpowiedz'; }
  }

  const byloDobrze = (wpisane === stan.pytanie.odpowiedz);
  stan.buforJeden = '';
  if (byloDobrze) odswiezOdpowiedzArytm();
  
  // Timeout zależny od poprawnego bądź błędnego działania -> Przejście do następnego pytania
  setTimeout(() => { if (stan.gra) nastepnePytanie(); }, byloDobrze ? 0 : 950);
}
