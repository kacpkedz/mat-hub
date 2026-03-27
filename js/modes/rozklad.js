
function zbudujWielomian(w, B, C) {
  let html = w === 1 ? `x<sup>2</sup>` : `${w}x<sup>2</sup>`;
  if (B !== 0) {
    html += ` ${szary(B > 0 ? '+' : '−')} ${Math.abs(B) === 1 ? 'x' : `${Math.abs(B)}x`}`;
  }
  if (C !== 0) {
    html += ` ${szary(C > 0 ? '+' : '−')} ${Math.abs(C)}`;
  }
  return html + ` ${bDb('= 0')}`;
}

function zbudujPostacIloczynowa(r1, r2, wspolczynnik, ujawnij) {
  const przedrostek = wspolczynnik === 1 ? '' : `${wspolczynnik}`;

  const nawias = (r, indeks) => {
    if (r === 0) return '(x)';
    const znak = r > 0 ? '−' : '+';
    const wartosc = Math.abs(r);
    if (ujawnij) {
      return `(x ${szary(znak)} ${zielony(wartosc)})`;
    }
    const wpisane = stan.buforDwa[indeks] || '?';
    return `(x ${szary(znak)} ${blank(wpisane, `b${indeks}`)})`;
  };

  if (r1 === r2 && ujawnij) {
    return `${przedrostek}(x ${szary(r1 > 0 ? '−' : '+')} ${zielony(Math.abs(r1))})<sup>2</sup> ${bDb('= 0')}`;
  }

  return `${przedrostek}${nawias(r1, 0)}${nawias(r2, 1)} ${bDb('= 0')}`;
}

function odswiezTabyA(etykiety) {
  etykiety.forEach((et, i) => {
    etA[i].textContent = et;
    polaA[i].className = 'pole-odpowiedzi' + (i === stan.aktywnePoleDwa ? ' aktywny' : '');
  });
  const taby = el('tabyA').querySelectorAll('.tab-pola');
  taby.forEach((t, i) => {
    t.textContent = etykiety[i];
    t.classList.toggle('aktywny', i === stan.aktywnePoleDwa);
  });
}

const modeRozklad = {
  generuj: function() {
    const cfg = POZIOMY[stan.poziom];
    const wspolczynnik = losujZ(cfg.wspolczynniki);

    const losujPierwiastek = () => {
      const wartosc = losuj(1, cfg.rozkladMax);
      const znak = cfg.ujemneRzerwiastki && Math.random() < 0.5 ? -1 : 1;
      return wartosc * znak;
    };

    let r1 = losujPierwiastek();
    let r2 = cfg.podwojnyPierwiastek && Math.random() < 0.2 ? r1 : losujPierwiastek();

    const B = -wspolczynnik * (r1 + r2);
    const C =  wspolczynnik * r1 * r2;

    const rownanieHtml = zbudujWielomian(wspolczynnik, B, C);
    stan.pytanie = { 
      r1, r2, wspolczynnik, 
      text: rownanieHtml.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') 
    };
    stan.buforDwa = ['', ''];
    stan.aktywnePoleDwa = 0;

    polaA[0].style.display = '';
    polaA[1].style.display = '';
    
    el('tabyA').querySelectorAll('.tab-pola').forEach(t => t.style.display = '');

    const sep = el('klawiaturaPolaA').querySelector('.separator-pol');
    if (sep) sep.style.display = '';

    etykietaPytania.textContent = 'Miejsca zerowe';

    el('pytanieWielomian').innerHTML = rownanieHtml;
    el('podpowiedzIloczynowa').innerHTML = zbudujPostacIloczynowa(r1, r2, wspolczynnik, false);

    odswiezTabyA(['x₁', 'x₂']);
    this.odswiez();
  },

  odswiez: function() {
    stan.buforDwa.forEach((wartosc, i) => {
      valA[i].textContent = wartosc || '?';
      valA[i].className = 'wartosc-pola' + (wartosc ? '' : ' placeholder');
    });
    
    if (stan.pytanie) {
      const { r1, r2, wspolczynnik } = stan.pytanie;
      el('podpowiedzIloczynowa').innerHTML = zbudujPostacIloczynowa(r1, r2, wspolczynnik, false);
    }
  },

  sprawdz: function() {
    const v0 = parseInt(stan.buforDwa[0]);
    const v1 = parseInt(stan.buforDwa[1]);
    if (isNaN(v0) || isNaN(v1)) return;

    const { r1, r2, wspolczynnik } = stan.pytanie;
    const abs1 = Math.abs(r1), abs2 = Math.abs(r2);
    const ok = (v0 === abs1 && v1 === abs2) || (v0 === abs2 && v1 === abs1);

    if (ok) {
      trafiony();
    } else {
      const dobraOdpHTML = zbudujPostacIloczynowa(r1, r2, wspolczynnik, true);
      bledny(stan.pytanie.text, dobraOdpHTML.replace(/<[^>]*>?/gm, ''));
      el('podpowiedzIloczynowa').innerHTML = dobraOdpHTML;
    }
    setTimeout(() => { if (stan.gra) nastepnePytanie(); }, ok ? 160 : 1200);
  },

  ujawnij: function() {
    const { r1, r2, wspolczynnik } = stan.pytanie;
    const odp = zbudujPostacIloczynowa(r1, r2, wspolczynnik, true);
    el('podpowiedzIloczynowa').innerHTML = odp;
    return { q: stan.pytanie.text, a: odp.replace(/<[^>]*>?/gm, '') };
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
      stan.buforDwa[f] = zmienZnak(stan.buforDwa[f]); this.odswiez();
    } else if (stan.buforDwa[f].replace('-', '').length < 3) {
      stan.buforDwa[f] += akcja;
      this.odswiez();
    }
  },
  
  tab: function() {
    stan.aktywnePoleDwa = (stan.aktywnePoleDwa + 1) % 2; 
    odswiezTabyA(['x₁', 'x₂']); 
    this.odswiez();
  }
};
