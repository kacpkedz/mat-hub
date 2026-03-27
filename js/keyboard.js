
function initKeyboard() {

  // Klawiatury na wspólnym kontrolerze
  const obsluzDotyk = (e) => {
    const btn = e.target.closest('.klawisz');
    if (!btn || !stan.gra) return;
    
    // Ignorowanie e.preventDefault() dla eventów touch/pointer powodujących emulowane mouse events, dla plynności mobilnej
    const akcja = btn.dataset.akcja || btn.dataset.b || btn.dataset.c;
    if (akcja) getActiveMode().wcisnieto(akcja);
  };

  el('klawiaturaDzialania').addEventListener('click', obsluzDotyk);
  el('klawiaturaPolaA').addEventListener('click', obsluzDotyk);
  el('klawiaturaPolaB').addEventListener('click', obsluzDotyk);

  // Klawiatura fizyczna
  document.addEventListener('keydown', e => {
    if (!stan.gra) return;
    const aktywny = getActiveMode();

    if (e.key >= '0' && e.key <= '9') {
      aktywny.wcisnieto(e.key);
    } else if (e.key === '-') {
      aktywny.wcisnieto('-');
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      aktywny.wcisnieto('del');
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      aktywny.wcisnieto('ok');
    } else if (e.key === 'Escape') {
      aktywny.wcisnieto('clr');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (aktywny.tab) aktywny.tab();
    }
  });

  const ustawCus = (index, typ) => {
    if (!stan.gra) return;
    if (typ === 'A') {
      stan.aktywnePoleDwa = index;
      if (stan.trybGry === 'rozklad') {
        odswiezTabyA(['x₁', 'x₂']);
      }
    }
    if (typ === 'B') stan.aktywnePoleTrzy = index;
    
    getActiveMode().odswiez();
  };

  polaA.forEach((pole, i) => {
    pole.addEventListener('pointerdown', e => { e.preventDefault(); ustawCus(i, 'A'); });
  });
  el('tabyA').querySelectorAll('.tab-pola').forEach((tab, i) => {
    tab.addEventListener('pointerdown', e => { e.preventDefault(); ustawCus(i, 'A'); });
  });

  polaB.forEach((pole, i) => {
    pole.addEventListener('pointerdown', e => {
      if (!stan.pytanie || i >= stan.pytanie.odpowiedzi.length) return;
      e.preventDefault(); 
      ustawCus(i, 'B'); 
    });
  });
  el('tabyB').querySelectorAll('.tab-pola').forEach((tab, i) => {
    tab.addEventListener('pointerdown', e => { 
      if (!stan.pytanie) return;
      e.preventDefault(); 
      ustawCus(i % stan.pytanie.odpowiedzi.length, 'B'); 
    });
  });
}
