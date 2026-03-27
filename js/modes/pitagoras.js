
const TROJKI_PITAGOREJSKIE = [
  [3,4,5], [5,12,13], [6,8,10], [8,15,17], [7,24,25],
  [9,12,15], [10,24,26], [12,16,20], [15,20,25], [20,21,29],
  [9,40,41], [12,35,37], [11,60,61], [13,84,85], [6,8,10],
];

const modePitagoras = {
  generuj: function() {
    const cfg = POZIOMY[stan.poziom];
    const pasujace = TROJKI_PITAGOREJSKIE.filter(([a, b, c]) => c <= cfg.pitagorasMax);
    const trojka = losujZ(pasujace.length ? pasujace : TROJKI_PITAGOREJSKIE);
    const [a, b, c] = trojka;
    const szukamy = losuj(0, 2);

    let dane, szukanaWartosc, etykietyPol, wzor;

    if (szukamy === 0) {
      dane = { a, b, c, szukamy: 'c' };
      szukanaWartosc = c;
      etykietyPol = ['c'];
      wzor = `a=${a}, b=${b} → c`;
      el('pytaniePitagoras').innerHTML = `a=${a}, b=${b} ${bDb('→')} c ${bDb('=')} <span class="placeholder odpowiedz" id="odpPit">?</span>`;
    } else if (szukamy === 1) {
      dane = { a, b, c, szukamy: 'b' };
      szukanaWartosc = b;
      etykietyPol = ['b'];
      wzor = `a=${a}, c=${c} → b`;
      el('pytaniePitagoras').innerHTML = `a=${a}, c=${c} ${bDb('→')} b ${bDb('=')} <span class="placeholder odpowiedz" id="odpPit">?</span>`;
    } else {
      dane = { a, b, c, szukamy: 'a' };
      szukanaWartosc = a;
      etykietyPol = ['a'];
      wzor = `b=${b}, c=${c} → a`;
      el('pytaniePitagoras').innerHTML = `b=${b}, c=${c} ${bDb('→')} a ${bDb('=')} <span class="placeholder odpowiedz" id="odpPit">?</span>`;
    }

    stan.pytanie = { ...dane, szukanaWartosc, text: wzor };
    stan.buforDwa = ['', ''];
    stan.aktywnePoleDwa = 0;
    etykietaPytania.textContent = 'Twierdzenie Pitagorasa';

    this.rysujTrojkat(dane, null, false);

    polaA[0].style.display = '';
    polaA[1].style.display = 'none';
    el('tabyA').querySelectorAll('.tab-pola').forEach((t, i) => {
      t.style.display = i === 0 ? '' : 'none';
    });
    el('tabyA').querySelector('[data-pole="0"]').textContent = etykietyPol[0];
    etA[0].textContent = etykietyPol[0];

    const sep = document.querySelector('#klawiaturaPolaA .separator-pol');
    if (sep) sep.style.display = 'none';

    this.odswiez();
  },

  rysujTrojkat: function(dane, wpisane, ujawnij) {
    const svg = el('trojkatSVG');
    if(!svg) return;
    const { a, b, c, szukamy } = dane;

    const X_LEWY = 50, Y_DOL = 125;   
    const X_PRAWY = 190, Y_DOL2 = 125; 
    const X_LEWY2 = 50, Y_GORA = 25;  

    const kolorBoku = (bok) => {
      if (ujawnij) return 'var(--zielony)';
      return bok === szukamy ? 'var(--akcent)' : 'var(--tekst2)';
    };

    const etykietaBoku = (bok, wartosc) => {
      if (ujawnij) return String(wartosc);
      if (bok !== szukamy) return String(wartosc);
      return (wpisane && wpisane !== '-') ? wpisane : '?';
    };

    svg.innerHTML = `
      <line x1="${X_LEWY}" y1="${Y_DOL}" x2="${X_PRAWY}" y2="${Y_DOL2}" stroke="${kolorBoku('a')}" stroke-width="2.5"/>
      <line x1="${X_LEWY}" y1="${Y_DOL}" x2="${X_LEWY2}" y2="${Y_GORA}" stroke="${kolorBoku('b')}" stroke-width="2.5"/>
      <line x1="${X_PRAWY}" y1="${Y_DOL2}" x2="${X_LEWY2}" y2="${Y_GORA}" stroke="${kolorBoku('c')}" stroke-width="2.5"/>
      <polyline points="${X_LEWY+13},${Y_DOL} ${X_LEWY+13},${Y_DOL-13} ${X_LEWY},${Y_DOL-13}" fill="none" stroke="var(--tekst3)" stroke-width="1.5"/>
      <text x="${(X_LEWY+X_PRAWY)/2}" y="${Y_DOL+14}" text-anchor="middle" font-family="DM Mono,monospace" font-size="14" fill="${kolorBoku('a')}">a=${etykietaBoku('a',a)}</text>
      <text x="${X_LEWY-8}" y="${(Y_DOL+Y_GORA)/2+5}" text-anchor="end" font-family="DM Mono,monospace" font-size="14" fill="${kolorBoku('b')}">b=${etykietaBoku('b',b)}</text>
      <text x="${(X_PRAWY+X_LEWY2)/2+8}" y="${(Y_DOL2+Y_GORA)/2-8}" text-anchor="start" font-family="DM Mono,monospace" font-size="14" fill="${kolorBoku('c')}">c=${etykietaBoku('c',c)}</text>
    `;
  },

  odswiez: function() {
    valA[0].textContent = stan.buforDwa[0] || '?';
    valA[0].className = 'wartosc-pola' + (stan.buforDwa[0] ? '' : ' placeholder');
    
    const odpPit = el('odpPit');
    const v = stan.buforDwa[0];
    if (odpPit) {
      odpPit.textContent = v || '?';
      odpPit.className = 'odpowiedz' + (v ? '' : ' placeholder');
    }
    if (stan.pytanie) this.rysujTrojkat(stan.pytanie, v, false);
  },

  sprawdz: function() {
    const v = parseInt(stan.buforDwa[0]);
    if (isNaN(v)) return;

    const ok = v === stan.pytanie.szukanaWartosc;
    if (ok) {
      trafiony();
      this.rysujTrojkat(stan.pytanie, null, true);
    } else {
      bledny(stan.pytanie.text, stan.pytanie.szukanaWartosc);
      const odpPit = el('odpPit');
      if (odpPit) { 
        odpPit.innerHTML = zielony(stan.pytanie.szukanaWartosc); 
        odpPit.classList.remove('placeholder'); 
      }
      this.rysujTrojkat(stan.pytanie, null, true);
    }
    
    setTimeout(() => { if (stan.gra) nastepnePytanie(); }, ok ? 160 : 1100);
  },

  ujawnij: function() {
    const odpPit = el('odpPit');
    if (odpPit) {
      odpPit.innerHTML = zielony(stan.pytanie.szukanaWartosc);
      odpPit.classList.remove('placeholder');
    }
    this.rysujTrojkat(stan.pytanie, null, true);
    return { q: stan.pytanie.text, a: stan.pytanie.szukanaWartosc };
  },

  wcisnieto: function(akcja) {
    const f = stan.aktywnePoleDwa;
    if (akcja === 'ok') {
      this.sprawdz();
    } else if (akcja === 'skip') {
      pominPytanie();
    } else if (akcja === 'clr') {
      stan.buforDwa[f] = ''; this.odswiez();
    } else if (akcja === 'del') {
      stan.buforDwa[f] = stan.buforDwa[f].slice(0, -1); this.odswiez();
    } else if (akcja === '-') {
      this.odswiez(); // pitagoras doesn't allow minus
    } else if (stan.buforDwa[f].replace('-', '').length < 3) {
      stan.buforDwa[f] += akcja;
      this.odswiez();
    }
  }
};
