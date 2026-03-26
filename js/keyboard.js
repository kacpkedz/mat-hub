// ===========================================
// OBSŁUGA KLAWIATURY EKRANOWEJ
// ===========================================

// --- Wariant Jedno Pole (Działania arytmetyczne) ---
el('klawiaturaDzialania').addEventListener('pointerdown', e => {
  const klawisz = e.target.closest('[data-akcja]');
  if (!klawisz || !stan.gra) return;
  e.preventDefault();
  const akcja = klawisz.dataset.akcja;

  if (akcja === 'ok') {
    sprawdzDzialanie();
  } else if (akcja === 'skip') {
    pominPytanie();
  } else if (akcja === 'clr') {
    stan.buforJeden = ''; 
    odswiezOdpowiedzArytm();
  } else if (akcja === 'del') {
    stan.buforJeden = stan.buforJeden.slice(0, -1); 
    odswiezOdpowiedzArytm();
  } else if (akcja === '-') {
    stan.buforJeden = zmienZnak(stan.buforJeden); 
    odswiezOdpowiedzArytm();
  } else if (stan.buforJeden.replace('-', '').length < 4) {
    stan.buforJeden += akcja; 
    odswiezOdpowiedzArytm();
  }
});

// --- Wariant Dwa Pola (Rozkład, Pitagoras) ---
el('klawiaturaPolaA').addEventListener('pointerdown', e => {
  const klawisz = e.target.closest('[data-b]');
  if (!klawisz || !stan.gra) return;
  e.preventDefault();
  const akcja = klawisz.dataset.b;
  const f = stan.aktywnePoleDwa;

  if (akcja === 'ok') {
    if (stan.trybGry === 'rozklad') sprawdzRozklad();
    else if (stan.trybGry === 'pitagoras') sprawdzPitagoras();
    return;
  }
  if (akcja === 'skip') { pominPytanie(); return; }
  if (akcja === 'clr') { stan.buforDwa[f] = ''; odswiezPolaA(); return; }
  if (akcja === 'del') { stan.buforDwa[f] = stan.buforDwa[f].slice(0, -1); odswiezPolaA(); return; }
  if (akcja === '-' && stan.trybGry === 'rozklad') {
    stan.buforDwa[f] = zmienZnak(stan.buforDwa[f]);
    odswiezPolaA();
    return;
  }
  // Blokada inputu (max 3 cyfry dla trójmianów)
  if (stan.buforDwa[f].replace('-', '').length < 3) {
    stan.buforDwa[f] += akcja;
    odswiezPolaA();
  }
});

// --- Wariant Trzy Pola (Wzory Skróconego Mnożenia) ---
el('klawiaturaPolaB').addEventListener('pointerdown', e => {
  const klawisz = e.target.closest('[data-c]');
  if (!klawisz || !stan.gra) return;
  e.preventDefault();
  const akcja = klawisz.dataset.c;
  const f = stan.aktywnePoleTrzy;

  if (akcja === 'ok') { sprawdzWzory(); return; }
  if (akcja === 'skip') { pominPytanie(); return; }
  if (akcja === 'clr') { stan.buforTrzy[f] = ''; odswiezPolaB(); return; }
  if (akcja === 'del') { stan.buforTrzy[f] = stan.buforTrzy[f].slice(0, -1); odswiezPolaB(); return; }
  if (akcja === '-') return; // System wyklucza wartości na minus we wzorach
  if (stan.buforTrzy[f].length < 4) {
    stan.buforTrzy[f] += akcja; 
    odswiezPolaB();
  }
});

// ===========================================
// OBSŁUGA KLAWIATURY FIZYCZNEJ (Desktop / Chromebooki)
// ===========================================

document.addEventListener('keydown', e => {
  if (!stan.gra) return;

  // Numeryczna
  if (e.key >= '0' && e.key <= '9') {
    wcisnietoCyfre(e.key);
  } else if (e.key === '-') {
    wcisnietoMinus();
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    wcisnietoKasuj();
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    wcisnietoZatwierdz();
  } else if (e.key === 'Escape') {
    wcisnietoCzysc();
  } else if (e.key === 'Tab') {
    e.preventDefault();
    wcisnietoTab();
  }
});

// Przekierowanie logiki fizycznej klawiatury na kontrolery interfejsu (Delegacje stanu)
function wcisnietoCyfre(cyfra) {
  if (stan.trybGry === 'dzialania') {
    if (stan.buforJeden.replace('-', '').length < 4) { stan.buforJeden += cyfra; odswiezOdpowiedzArytm(); }
  } else if (stan.trybGry === 'rozklad' || stan.trybGry === 'pitagoras') {
    const f = stan.aktywnePoleDwa;
    if (stan.buforDwa[f].replace('-', '').length < 3) { stan.buforDwa[f] += cyfra; odswiezPolaA(); }
  } else if (stan.trybGry === 'wzory') {
    const f = stan.aktywnePoleTrzy;
    if (stan.buforTrzy[f].length < 4) { stan.buforTrzy[f] += cyfra; odswiezPolaB(); }
  }
}

function wcisnietoMinus() {
  if (stan.trybGry === 'dzialania') { stan.buforJeden = zmienZnak(stan.buforJeden); odswiezOdpowiedzArytm(); }
  else if (stan.trybGry === 'rozklad') { stan.buforDwa[stan.aktywnePoleDwa] = zmienZnak(stan.buforDwa[stan.aktywnePoleDwa]); odswiezPolaA(); }
}

function wcisnietoKasuj() {
  if (stan.trybGry === 'dzialania') { stan.buforJeden = stan.buforJeden.slice(0, -1); odswiezOdpowiedzArytm(); }
  else if (stan.trybGry === 'rozklad' || stan.trybGry === 'pitagoras') { const f = stan.aktywnePoleDwa; stan.buforDwa[f] = stan.buforDwa[f].slice(0, -1); odswiezPolaA(); }
  else if (stan.trybGry === 'wzory') { const f = stan.aktywnePoleTrzy; stan.buforTrzy[f] = stan.buforTrzy[f].slice(0, -1); odswiezPolaB(); }
}

function wcisnietoZatwierdz() {
  if (stan.trybGry === 'dzialania') sprawdzDzialanie();
  else if (stan.trybGry === 'rozklad') sprawdzRozklad();
  else if (stan.trybGry === 'wzory') sprawdzWzory();
  else if (stan.trybGry === 'pitagoras') sprawdzPitagoras();
}

function wcisnietoCzysc() {
  if (stan.trybGry === 'dzialania') { stan.buforJeden = ''; odswiezOdpowiedzArytm(); }
  else if (stan.trybGry === 'rozklad' || stan.trybGry === 'pitagoras') { stan.buforDwa[stan.aktywnePoleDwa] = ''; odswiezPolaA(); }
  else if (stan.trybGry === 'wzory') { stan.buforTrzy[stan.aktywnePoleTrzy] = ''; odswiezPolaB(); }
}

function wcisnietoTab() {
  if (stan.trybGry === 'rozklad') { stan.aktywnePoleDwa = (stan.aktywnePoleDwa + 1) % 2; odswiezTabyA(['x₁', 'x₂']); odswiezPolaA(); }
  else if (stan.trybGry === 'wzory' && stan.pytanie) { stan.aktywnePoleTrzy = (stan.aktywnePoleTrzy + 1) % stan.pytanie.odpowiedzi.length; odswiezPolaB(); }
}

// Zmiany selekcji przy wciśnięciu myszą lub palcem pola A/B
polaA.forEach((pole, i) => {
  pole.addEventListener('pointerdown', e => {
    if (!stan.gra) return;
    e.preventDefault();
    stan.aktywnePoleDwa = i;
    odswiezPolaA();
    if (stan.trybGry === 'rozklad') odswiezTabyA(['x₁', 'x₂']);
  });
});
el('tabyA').querySelectorAll('.tab-pola').forEach((tab, i) => {
  tab.addEventListener('pointerdown', e => {
    if (!stan.gra) return;
    e.preventDefault();
    stan.aktywnePoleDwa = i;
    if (stan.trybGry === 'rozklad') odswiezTabyA(['x₁', 'x₂']);
    odswiezPolaA();
  });
});

polaB.forEach((pole, i) => {
  pole.addEventListener('pointerdown', e => {
    if (!stan.gra || !stan.pytanie || i >= stan.pytanie.odpowiedzi.length) return;
    e.preventDefault();
    stan.aktywnePoleTrzy = i;
    odswiezPolaB();
  });
});
el('tabyB').querySelectorAll('.tab-pola').forEach((tab, i) => {
  tab.addEventListener('pointerdown', e => {
    if (!stan.gra || !stan.pytanie) return;
    e.preventDefault();
    // Zawija zakładki
    stan.aktywnePoleTrzy = i % stan.pytanie.odpowiedzi.length;
    odswiezPolaB();
  });
});
