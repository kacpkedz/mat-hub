// ===========================================
// NARZĘDZIA POMOCNICZE
// ===========================================

// Krótkie odwołanie do DOM
const el = id => document.getElementById(id);

// Referencje głównych interfejsów gry
const ekranMenu   = el('ekranMenu');
const ekranWyniki = el('ekranWyniki');
const karta              = el('karta');
const etykietaPytania    = el('etykietaPytania');
const popAnimacja        = el('popAnimacja');
const licznikPunktow     = el('licznikPunktow');
const wyswietlaczKombo   = el('wyswietlaczKombo');
const kropkiStreak       = el('kropkiStreak');
const paselKomboWrap     = el('paselKomboWrap');
const pasekKombo         = el('pasekKombo');
const toastEl            = el('toast');

// Powłoki poszczególnych trybów
const widokDzialania     = el('widokDzialania');
const widokRozklad       = el('widokRozklad');
const widokWzory         = el('widokWzory');
const widokPitagoras     = el('widokPitagoras');

// Kontenery klawiatur ekranowych
const klawiaturaDzialania = el('klawiaturaDzialania');
const klawiaturaPolaA     = el('klawiaturaPolaA');
const klawiaturaPolaB     = el('klawiaturaPolaB');

// Ekrany wprowadzania (Dwa Pola)
const polaA = [el('poleA0'), el('poleA1')];
const valA  = [el('valA0'),  el('valA1')];
const etA   = [el('etA0'),   el('etA1')];

// Ekrany wprowadzania (Trzy Pola)
const polaB = [el('poleB0'), el('poleB1'), el('poleB2')];
const valB  = [el('valB0'),  el('valB1'),  el('valB2')];
const etB   = [el('etB0'),   el('etB1'),   el('etB2')];

// Inicjalizacja pięciu kropek (Wizualny pasek streaku)
for (let i = 0; i < 5; i++) {
  const k = document.createElement('div');
  k.className = 'kropka';
  kropkiStreak.appendChild(k);
}
const kropki = [...kropkiStreak.querySelectorAll('.kropka')];

// ===========================================
// FUNKCJE MATEMATYCZNE / RANDOMOWERY
// ===========================================

// Zwraca losową całkowitą od "a" do "b" włącznie
function losuj(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// Zwraca losowy element dostarczonej tablicy
function losujZ(tablica) {
  return tablica[Math.floor(Math.random() * tablica.length)];
}

// ===========================================
// FORMACJA HTML STYLIZOWANEGO TEKSTU
// ===========================================

function szary(tekst) {
  return `<span style="color:var(--tekst2)">${tekst}</span>`;
}

function bDb(tekst) {
  return `<span style="color:var(--tekst3)">${tekst}</span>`;
}

function zielony(tekst) {
  return `<span style="color:var(--zielony)">${tekst}</span>`;
}

function blank(wartosc, id) {
  return `<span class="blank"${id ? ` id="${id}"` : ''}>${wartosc || '?'}</span>`;
}

// Zmiana znaku stringa z zachowaniem ew. znaku ujemnego klawiatury UI
function zmienZnak(bufor) {
  if (!bufor)          return '-';
  if (bufor === '-')   return '';
  if (bufor[0] === '-') return bufor.slice(1);
  return '-' + bufor;
}

// ===========================================
// WIZUALIZACJE, PASKI I KOMUNIKATY (UI)
// ===========================================

function animacjaPop(tekst, kolor) {
  popAnimacja.textContent = tekst;
  popAnimacja.style.color = kolor;
  popAnimacja.style.transition = 'none';
  popAnimacja.style.opacity = '1';
  popAnimacja.style.transform = 'translate(-50%, -50%) scale(1)';

  requestAnimationFrame(() => {
    popAnimacja.style.transition = 'opacity 0.48s, transform 0.48s';
    popAnimacja.style.opacity = '0';
    popAnimacja.style.transform = 'translate(-50%, -70%) scale(1.3)';
  });
}

// Efekt błysku (zielony za poprawne, czerwony i trzęsienie za błąd)
function migniecie(klasa) {
  karta.classList.remove('trafiony', 'bledny');
  void karta.offsetWidth; 
  karta.classList.add(klasa);
  setTimeout(() => karta.classList.remove(klasa), 300);
}

// Pasek passy aktualizowany do 5 kropek
function odswiezStreak() {
  const pozycja = stan.streak % 5;
  const ile = stan.streak > 0 && pozycja === 0 ? 5 : pozycja;
  kropki.forEach((k, i) => k.classList.toggle('aktywna', i < ile));

  if (stan.mnoznikKombo >= 2) {
    wyswietlaczKombo.textContent = `×${stan.mnoznikKombo}`;
    wyswietlaczKombo.classList.add('widoczny');
  } else {
    wyswietlaczKombo.classList.remove('widoczny');
  }
}

// Komunikat ekranowy
function pokazToast(komunikat) {
  toastEl.textContent = komunikat;
  toastEl.classList.remove('widoczny');
  void toastEl.offsetWidth;
  toastEl.classList.add('widoczny');
}

// ===========================================
// TIMER BONUSU COMBO
// ===========================================
// Gracz ma ograniczony czas do zdobycia następnych mnożników kombo

const CZAS_KOMBO = 8; // Opóźnienie wygaśnięcia
let timerKombo = null;
let pozostalyCzasKombo = 0;

function startujTimerKombo() {
  zatrzymajTimerKombo();
  pozostalyCzasKombo = CZAS_KOMBO;
  paselKomboWrap.style.display = '';
  pasekKombo.classList.remove('niski');
  pasekKombo.style.transition = 'none';
  pasekKombo.style.width = '100%';

  timerKombo = setInterval(() => {
    pozostalyCzasKombo -= 0.1;
    const procent = Math.max(0, pozostalyCzasKombo / CZAS_KOMBO * 100);
    pasekKombo.style.transition = 'width 0.1s linear';
    pasekKombo.style.width = procent + '%';
    
    // Zapalenie alertu na niższym szczeblu czasu
    if (pozostalyCzasKombo <= 2) pasekKombo.classList.add('niski');
    
    // Timeout i kara
    if (pozostalyCzasKombo <= 0) {
      zatrzymajTimerKombo();
      if (stan.streak >= 5) {
        stan.streak = 0;
        stan.mnoznikKombo = 1;
        odswiezStreak();
      }
    }
  }, 100);
}

function zatrzymajTimerKombo() {
  clearInterval(timerKombo);
  paselKomboWrap.style.display = 'none';
}
