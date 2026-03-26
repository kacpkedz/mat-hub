// ===========================================
// TRYB 2: ROZKŁAD KWADRATOWY
// ===========================================
// Gracz widzi trójmian (ax² + bx + c = 0) i wyciąga dwa miejsca zerowe

function generujRozklad() {
  const cfg = POZIOMY[stan.poziom];
  const wspolczynnik = losujZ(cfg.wspolczynniki);

  const losujPierwiastek = () => {
    const wartosc = losuj(1, cfg.rozkladMax);
    const znak = cfg.ujemneRzerwiastki && Math.random() < 0.5 ? -1 : 1;
    return wartosc * znak;
  };

  let r1 = losujPierwiastek();
  let r2 = cfg.podwojnyPierwiastek && Math.random() < 0.2
    ? r1  // Szansa na podwójny pierwiastek w trudnym poziomie
    : losujPierwiastek();

  const B = -wspolczynnik * (r1 + r2);
  const C =  wspolczynnik * r1 * r2;

  stan.pytanie = { r1, r2, wspolczynnik };
  stan.buforDwa = ['', ''];
  stan.aktywnePoleDwa = 0;

  // Ukazuje obydwa pola kluczowe (x1, x2) – bo Pitagoras korzysta częściowo z układu
  polaA[0].style.display = '';
  polaA[1].style.display = '';
  
  const taby = el('tabyA').querySelectorAll('.tab-pola');
  taby.forEach(t => t.style.display = '');

  const sep = el('klawiaturaPolaA').querySelector('.separator-pol');
  if (sep) sep.style.display = '';

  etykietaPytania.textContent = 'Miejsca zerowe';

  el('pytanieWielomian').innerHTML = zbudujWielomian(wspolczynnik, B, C);
  el('podpowiedzIloczynowa').innerHTML = zbudujPostacIloczynowa(r1, r2, wspolczynnik, false);

  odswiezTabyA(['x₁', 'x₂']);
  odswiezPolaA();
}

// Konstrukcja równania typu (w·x² + B·x + C = 0)
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

// Konstrukcja podpowiedzi wpisanej (x - x1)(x - x2) = 0
// 'ujawnij' - decyduje w zależności czy był błąd wyświetla zielone wartości, czy tylko zarys
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

// Globalnie na input values z dwóch tabów
function odswiezPolaA() {
  stan.buforDwa.forEach((wartosc, i) => {
    valA[i].textContent = wartosc || '?';
    valA[i].className = 'wartosc-pola' + (wartosc ? '' : ' placeholder');
  });
  
  if (stan.trybGry === 'rozklad' && stan.pytanie) {
    const { r1, r2, wspolczynnik } = stan.pytanie;
    el('podpowiedzIloczynowa').innerHTML = zbudujPostacIloczynowa(r1, r2, wspolczynnik, false);
  }
  
  if (stan.trybGry === 'pitagoras' && stan.pytanie) {
    const odpPit = el('odpPit');
    const v = stan.buforDwa[0];
    if (odpPit) {
      odpPit.textContent = v || '?';
      odpPit.className = 'odpowiedz' + (v ? '' : ' placeholder');
    }
    // Rysowanie dynamicznego SVG wyabstrahowane z plików pitagorasa
    if(typeof rysujTrojkat === 'function'){
      rysujTrojkat(stan.pytanie, v, false);
    }
  }
}

// Taby do wprowadzania pól
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

// Weryfikacja
function sprawdzRozklad() {
  const v0 = parseInt(stan.buforDwa[0]);
  const v1 = parseInt(stan.buforDwa[1]);
  if (isNaN(v0) || isNaN(v1)) return;

  const { r1, r2, wspolczynnik } = stan.pytanie;
  const abs1 = Math.abs(r1), abs2 = Math.abs(r2);
  const ok = (v0 === abs1 && v1 === abs2) || (v0 === abs2 && v1 === abs1); // Dowolna kolejność wprowadzania ok

  if (ok) {
    trafiony();
  } else {
    bledny();
    el('podpowiedzIloczynowa').innerHTML = zbudujPostacIloczynowa(r1, r2, wspolczynnik, true);
  }
  setTimeout(() => { if (stan.gra) nastepnePytanie(); }, ok ? 160 : 1200);
}
