// ===========================================
// LOSOWANIE NASTĘPNEGO PYTANIA
// ===========================================

function nastepnePytanie() {
  // Losowanie trybu na podstawie odznaczonych kart
  const dostepne = stan.aktywneTypy.length ? stan.aktywneTypy : ['dzialania'];
  stan.trybGry = losujZ(dostepne);

  // Manipulacja stylami poszczególnych widoków dla wybranego trybu
  widokDzialania.style.display  = stan.trybGry === 'dzialania'  ? '' : 'none';
  widokRozklad.style.display    = stan.trybGry === 'rozklad'    ? '' : 'none';
  widokWzory.style.display      = stan.trybGry === 'wzory'      ? '' : 'none';
  widokPitagoras.style.display  = stan.trybGry === 'pitagoras'  ? '' : 'none';

  klawiaturaDzialania.style.display = stan.trybGry === 'dzialania'  ? '' : 'none';
  klawiaturaPolaA.style.display     = (stan.trybGry === 'rozklad' || stan.trybGry === 'pitagoras') ? '' : 'none';
  klawiaturaPolaB.style.display     = stan.trybGry === 'wzory'      ? '' : 'none';

  // Inicjalizacja wybranego trybu z zaimportowanych plików z katalogu "modes/"
  if      (stan.trybGry === 'dzialania')  generujDzialanie();
  else if (stan.trybGry === 'rozklad')    generujRozklad();
  else if (stan.trybGry === 'wzory')      generujWzory();
  else if (stan.trybGry === 'pitagoras')  generujPitagoras();
}

// ===========================================
// PODSUMOWANIE POZA KLAWIATURAMI / POMIJANIE
// ===========================================

// Klawisz "Skip" do ominięcia pytania bez pkt 
function pominPytanie() {
  if (!stan.gra) return;
  bledny();

  // Odsłonięcie poprawnego wzoru
  if (stan.trybGry === 'dzialania') {
    const odp = el('odp');
    if (odp) { odp.textContent = stan.pytanie.odpowiedz; odp.className = 'odpowiedz'; }
  } else if (stan.trybGry === 'rozklad') {
    const { r1, r2, wspolczynnik } = stan.pytanie;
    el('podpowiedzIloczynowa').innerHTML = zbudujPostacIloczynowa(r1, r2, wspolczynnik, true);
  } else if (stan.trybGry === 'wzory') {
    ujawnijWzory();
  } else if (stan.trybGry === 'pitagoras') {
    const odpPit = el('odpPit');
    if (odpPit) {
      odpPit.innerHTML = zielony(stan.pytanie.szukanaWartosc);
      odpPit.classList.remove('placeholder');
    }
    rysujTrojkat(stan.pytanie, null, true);
  }

  // Wymuszone opóźnienie dla pokazania rozwiązania
  setTimeout(() => { if (stan.gra) nastepnePytanie(); }, 1100);
}

// Punktacja za pozytywny sygnał od wywołanego trybu gry
function trafiony() {
  stan.streak++;
  stan.poprawne++;
  if (stan.streak > stan.maxStreak) stan.maxStreak = stan.streak;

  stan.mnoznikKombo = Math.floor(stan.streak / 5) + 1;

  // Nagroda różniąca się zależnie od stopnia trudności trybu gry
  const bazowePunkty = stan.trybGry === 'dzialania' ? 10 : 20;
  const zdobyte = bazowePunkty * stan.mnoznikKombo;

  stan.punkty += zdobyte;
  licznikPunktow.textContent = stan.punkty;

  animacjaPop(`+${zdobyte}`, 'var(--zielony)');
  migniecie('trafiony');
  odswiezStreak();

  // Wibracje zarezerwowane na urządzenia dotykowe
  if (navigator.vibrate) navigator.vibrate(22);
  if (stan.streak > 0 && stan.streak % 5 === 0) pokazToast(`×${stan.mnoznikKombo} combo`);
  if (stan.mnoznikKombo >= 2) startujTimerKombo();
}

// Skasowanie mnożnika kombo za błędną logikę od wywołanego trybu gry
function bledny() {
  stan.bledne++;
  stan.streak = 0;
  stan.mnoznikKombo = 1;

  animacjaPop('✕', 'var(--czerwony)');
  migniecie('bledny');
  odswiezStreak();
  zatrzymajTimerKombo();

  if (navigator.vibrate) navigator.vibrate([40, 15, 40]);
}

// ===========================================
// START, PODSUMOWANI WYNIKÓW I MENU STARTOWE
// ===========================================

function rozpocznijGre() {
  stan.punkty = 0;
  stan.streak = 0;
  stan.maxStreak = 0;
  stan.poprawne = 0;
  stan.bledne = 0;
  stan.mnoznikKombo = 1;
  stan.gra = true;

  licznikPunktow.textContent = '0';
  kropki.forEach(k => k.classList.remove('aktywna'));
  wyswietlaczKombo.classList.remove('widoczny');
  zatrzymajTimerKombo();

  ekranMenu.classList.add('ukryty');
  ekranWyniki.classList.add('ukryty');

  nastepnePytanie();
}

function pokazWyniki() {
  stan.gra = false;
  zatrzymajTimerKombo();

  el('wynikPunkty').textContent   = stan.punkty;
  el('wynikPoprawne').textContent  = stan.poprawne;
  el('wynikKombo').textContent     = stan.maxStreak;

  const wszystkie = stan.poprawne + stan.bledne;
  el('wynikTrafinosc').textContent = wszystkie
    ? Math.round(stan.poprawne / wszystkie * 100) + '%'
    : '—';

  const komunikaty = [
    [0,   'Ćwicz dalej!'],
    [80,  'Nieźle!'],
    [200, 'Świetnie!'],
    [450, 'Rewelacja!'],
    [800, 'Legenda!'],
  ];
  
  let komunikat = '';
  for (const [prog, tekst] of komunikaty) {
    if (stan.punkty >= prog) komunikat = tekst;
  }
  el('wynikKomunikat').textContent = komunikat;

  ekranWyniki.classList.remove('ukryty');
  if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 80]);
}

function wrocDoMenu() {
  stan.gra = false;
  zatrzymajTimerKombo();
  ekranWyniki.classList.add('ukryty');
  ekranMenu.classList.remove('ukryty');
}

// ===========================================
// DEKLARACJA NASŁUCHIWACZY MENU START
// ===========================================

el('btnGraj').addEventListener('click', rozpocznijGre);
el('btnJeszczeRaz').addEventListener('click', rozpocznijGre);
el('btnDoMenu').addEventListener('click', wrocDoMenu);
el('btnMenu').addEventListener('click', pokazWyniki);

// Zbijanie focusa z innych przycisków wyboru poziomu (Tylko najnowszy przycisk staje sie AKTYWNY)
el('przyciskiPoziomu').querySelectorAll('.pigulka').forEach(btn => {
  btn.addEventListener('click', () => {
    el('przyciskiPoziomu').querySelectorAll('.pigulka').forEach(b => b.classList.remove('aktywny'));
    btn.classList.add('aktywny');
    stan.poziom = btn.dataset.poziom;
  });
});

// Zapamiętywanie wyboru operacji arytmetycznych w state
el('przyciskiDzialan').querySelectorAll('.przycisk-dzialania').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('aktywny');
    const aktywne = [...el('przyciskiDzialan').querySelectorAll('.przycisk-dzialania.aktywny')].map(b => b.dataset.op);
    if (!aktywne.length) { btn.classList.add('aktywny'); return; } // Wymagany minimum jeden operator
    stan.aktywneOperatory = aktywne;
  });
});

// Zapamiętywanie logiki zaznaczonych trybów
el('listaTrybow').querySelectorAll('.tryb').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('aktywny');
    const aktywne = [...el('listaTrybow').querySelectorAll('.tryb.aktywny')].map(b => b.dataset.tryb);
    if (!aktywne.length) { btn.classList.add('aktywny'); return; }
    stan.aktywneTypy = aktywne;
    // Blokowanie działań jeżeli tryb Działań jest opadnięty
    el('opcje-dzialan').classList.toggle('wyszarzony', !aktywne.includes('dzialania'));
  });
});

// ===========================================
// PWA ORAZ ZABEZPIECZENIA DOTYKU
// ===========================================

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Tłumienie przypadkowego zoomowania interfejsu PWA poprzez Multi-Touch Pinch
document.addEventListener('touchmove', e => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

// Tłumienie podwójnego ztapowania i efektu powiększania ekranu
let ostatniDotyk = 0;
document.addEventListener('touchend', e => {
  const teraz = Date.now();
  if (teraz - ostatniDotyk < 280 && e.target.tagName !== 'INPUT') e.preventDefault();
  ostatniDotyk = teraz;
}, { passive: false });
