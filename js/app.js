

const modyGry = {
  dzialania: modeDzialania,
  rozklad: modeRozklad,
  wzory: modeWzory,
  pitagoras: modePitagoras,
  ulamki: modeUlamki,
  procenty: modeProcenty
};

const getActiveMode = () => modyGry[stan.trybGry];

function nastepnePytanie() {
  const dostepne = stan.aktywneTypy.length ? stan.aktywneTypy : ['dzialania'];
  stan.trybGry = losujZ(dostepne);

  widokDzialania.style.display  = stan.trybGry === 'dzialania'  ? '' : 'none';
  widokRozklad.style.display    = stan.trybGry === 'rozklad'    ? '' : 'none';
  widokWzory.style.display      = stan.trybGry === 'wzory'      ? '' : 'none';
  widokPitagoras.style.display  = stan.trybGry === 'pitagoras'  ? '' : 'none';
  widokUlamki.style.display     = stan.trybGry === 'ulamki'     ? '' : 'none';
  widokProcenty.style.display   = stan.trybGry === 'procenty'   ? '' : 'none';

  klawiaturaDzialania.style.display = (stan.trybGry === 'dzialania' || stan.trybGry === 'procenty') ? '' : 'none';
  klawiaturaPolaA.style.display     = (stan.trybGry === 'rozklad' || stan.trybGry === 'pitagoras' || stan.trybGry === 'ulamki') ? '' : 'none';
  klawiaturaPolaB.style.display     = stan.trybGry === 'wzory'      ? '' : 'none';

  getActiveMode().generuj();
}

function pominPytanie() {
  if (!stan.gra) return;
  const aktywny = getActiveMode();
  let ujawnione = null;

  if (aktywny.ujawnij) ujawnione = aktywny.ujawnij();

  let uq = ujawnione ? ujawnione.q : "Pominięto pytanie";
  let ua = ujawnione ? ujawnione.a : "-";
  
  bledny(uq, ua);
  setTimeout(() => { if (stan.gra) nastepnePytanie(); }, 1100);
}

function trafiony() {
  stan.streak++;
  stan.poprawne++;
  if (stan.streak > stan.maxStreak) stan.maxStreak = stan.streak;
  
  if (stan.maxStreak > stan.maxComboZapisane) {
    stan.maxComboZapisane = stan.maxStreak;
    try { zapiszProfil(); } catch(e){}
  }

  stan.mnoznikKombo = Math.floor(stan.streak / 5) + 1;

  let bazowePunkty = 10;
  if (stan.trybGry === 'pitagoras' || stan.trybGry === 'rozklad') bazowePunkty = 20;
  if (stan.trybGry === 'wzory') bazowePunkty = 30;
  
  const zdobyte = bazowePunkty * stan.mnoznikKombo;
  stan.punkty += zdobyte;
  
  if (stan.punkty > stan.maxPunktyZapisane) {
    stan.maxPunktyZapisane = stan.punkty;
    try { zapiszProfil(); } catch(e){}
  }

  licznikPunktow.textContent = stan.punkty;

  animacjaPop(`+${zdobyte}`, 'var(--zielony)');
  migniecie('trafiony');
  odswiezStreak();
  playSound('pop');

  if (navigator.vibrate) navigator.vibrate(22);
  if (stan.streak > 0 && stan.streak % 5 === 0) {
    pokazToast(`×${stan.mnoznikKombo} combo`);
    playSound('combo');
  }
  if (stan.mnoznikKombo >= 2) startujTimerKombo();
}

function bledny(pytanieInfo, podpowiedzInfo) {
  if (!stan.gra) return;
  stan.bledne++;
  stan.streak = 0;
  stan.mnoznikKombo = 1;

  if (pytanieInfo && podpowiedzInfo) {
    stan.historiaBledow.push({ 
      pytanie: pytanieInfo, 
      poprawnie: (podpowiedzInfo !== '-' && podpowiedzInfo) ? podpowiedzInfo : null 
    });
    if (stan.historiaBledow.length > 12) stan.historiaBledow.shift();
  }

  zatrzymajTimerKombo();
  animacjaPop('✕', 'var(--czerwony)');
  migniecie('bledny');
  odswiezStreak();
  playSound('error');

  if (navigator.vibrate) navigator.vibrate([40, 15, 40]);
}

function rozpocznijGre() {
  stan.punkty = 0;
  stan.streak = 0;
  stan.maxStreak = 0;
  stan.poprawne = 0;
  stan.bledne = 0;
  stan.mnoznikKombo = 1;
  stan.gra = true;
  stan.historiaBledow = []; // Czyszczenie błędów z poprzedniej gry

  licznikPunktow.textContent = '0';
  kropki.forEach(k => k.classList.remove('aktywna'));
  wyswietlaczKombo.classList.remove('widoczny');
  zatrzymajTimerKombo();

  ekranMenu.classList.add('ukryty');
  ekranWyniki.classList.add('ukryty');

  nastepnePytanie();
  playSound('pop');
}

function rysujBledy() {
  const listaBledow = el('listaBledow');
  const kontener = el('kontenerBledow');
  kontener.innerHTML = '';
  
  if (stan.historiaBledow.length === 0) {
    listaBledow.classList.add('ukryty');
    return;
  }
  
  listaBledow.classList.remove('ukryty');
  stan.historiaBledow.forEach(blad => {
    const wiersz = document.createElement('div');
    wiersz.className = 'blad-wiersz';
    wiersz.innerHTML = `${blad.pytanie} → <span style="color:var(--zielony)">${blad.poprawnie}</span>`;
    kontener.appendChild(wiersz);
  });
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

  rysujBledy();

  ekranWyniki.classList.remove('ukryty');
  if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 80]);
  
  odswiezMenuWyniki(); 
}

function wrocDoMenu() {
  stan.gra = false;
  zatrzymajTimerKombo();
  ekranWyniki.classList.add('ukryty');
  ekranMenu.classList.remove('ukryty');
}

function odswiezMenuWyniki() {
  if (stan.maxPunktyZapisane > 0 || stan.maxComboZapisane > 0) {
    najlepszeWyniki.style.display = 'block';
    maxImie.textContent = stan.gracz;
    maxPkt.textContent = stan.maxPunktyZapisane;
    maxCmb.textContent = stan.maxComboZapisane;
  } else {
    najlepszeWyniki.style.display = 'none';
  }
}

// Inicjalizacja menu
nazwaGraczaInput.value = stan.gracz;
nazwaGraczaInput.addEventListener('input', (e) => {
  zalogujProfil(e.target.value);
  odswiezMenuWyniki();
});
el('btnGraj').addEventListener('click', rozpocznijGre);
el('btnJeszczeRaz').addEventListener('click', rozpocznijGre);
el('btnDoMenu').addEventListener('click', wrocDoMenu);
el('btnMenu').addEventListener('click', pokazWyniki);

el('przyciskiPoziomu').querySelectorAll('.pigulka').forEach(btn => {
  btn.addEventListener('click', () => {
    el('przyciskiPoziomu').querySelectorAll('.pigulka').forEach(b => b.classList.remove('aktywny'));
    btn.classList.add('aktywny');
    stan.poziom = btn.dataset.poziom;
  });
});

el('przyciskiDzialan').querySelectorAll('.przycisk-dzialania').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('aktywny');
    const aktywne = [...el('przyciskiDzialan').querySelectorAll('.przycisk-dzialania.aktywny')].map(b => b.dataset.op);
    if (!aktywne.length) { btn.classList.add('aktywny'); return; }
    stan.aktywneOperatory = aktywne;
  });
});

el('listaTrybow').querySelectorAll('.tryb').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('aktywny');
    const aktywne = [...el('listaTrybow').querySelectorAll('.tryb.aktywny')].map(b => b.dataset.tryb);
    if (!aktywne.length) { btn.classList.add('aktywny'); return; }
    stan.aktywneTypy = aktywne;
    el('opcje-dzialan').classList.toggle('wyszarzony', !aktywne.includes('dzialania'));
  });
});

// Zabezpieczenia PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

document.addEventListener('touchmove', e => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let ostatniDotyk = 0;
document.addEventListener('touchend', e => {
  const teraz = Date.now();
  if (teraz - ostatniDotyk < 280 && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') e.preventDefault();
  ostatniDotyk = teraz;
}, { passive: false });

initKeyboard();
odswiezMenuWyniki();
