function nwd(a, b) {
  return a ? nwd(b % a, a) : Math.abs(b);
}

const modeUlamki = {
  generuj: function() {
    const cfg = POZIOMY[stan.poziom];
    
    let l, m, g;
    do {
      l = losuj(1, cfg.ulamkiMax);
      m = losuj(2, cfg.ulamkiMax);
      g = nwd(l, m);
    } while (g === 1 || l === m || l % m === 0);
    
    const ansL = l / g;
    const ansM = m / g;

    stan.pytanie = { l, m, ansL, ansM, text: `${l}/${m}` };
    stan.buforDwa = ['', ''];
    stan.aktywnePoleDwa = 0;

    etykietaPytania.textContent = 'Skróć ułamek do uproszczonej formy';
    
    el('pytanieUlamki').innerHTML = `
      <div class="ulamek-kreska">${l}<span>${m}</span></div>
      ${bDb(' = ')} 
      <div class="ulamek-kreska">
        <span class="placeholder" id="odpUlL">?</span>
        <span><span class="placeholder" id="odpUlM">?</span></span>
      </div>
    `;

    polaA[0].style.display = '';
    polaA[1].style.display = '';
    el('tabyA').querySelectorAll('.tab-pola').forEach(t => t.style.display = '');

    const sep = el('klawiaturaPolaA').querySelector('.separator-pol');
    if (sep) sep.style.display = 'none'; 

    etA[0].textContent = 'Licznik';
    etA[1].textContent = 'Mianownik';
    const taby = el('tabyA').querySelectorAll('.tab-pola');
    taby[0].textContent = 'Licznik';
    taby[1].textContent = 'Mianownik';
    
    polaA[0].className = 'pole-odpowiedzi aktywny';
    polaA[1].className = 'pole-odpowiedzi';
    taby[0].classList.add('aktywny');
    taby[1].classList.remove('aktywny');

    this.odswiez();
  },
  
  odswiez: function() {
    valA[0].textContent = stan.buforDwa[0] || '?';
    valA[0].className = 'wartosc-pola' + (stan.buforDwa[0] ? '' : ' placeholder');
    valA[1].textContent = stan.buforDwa[1] || '?';
    valA[1].className = 'wartosc-pola' + (stan.buforDwa[1] ? '' : ' placeholder');
    
    const odpL = el('odpUlL');
    if (odpL) {
      odpL.textContent = stan.buforDwa[0] || '?';
      odpL.style.color = stan.buforDwa[0] ? 'var(--zielony)' : 'var(--tekst3)';
    }
    const odpM = el('odpUlM');
    if (odpM) {
      odpM.textContent = stan.buforDwa[1] || '?';
      odpM.style.color = stan.buforDwa[1] ? 'var(--zielony)' : 'var(--tekst3)';
    }
  },

  sprawdz: function() {
    const vL = parseInt(stan.buforDwa[0]);
    const vM = parseInt(stan.buforDwa[1]);
    if (isNaN(vL) || isNaN(vM)) return;

    const { ansL, ansM } = stan.pytanie;
    const ok = (vL === ansL && vM === ansM);

    if (ok) {
      trafiony();
    } else {
      bledny(`${stan.pytanie.l}/${stan.pytanie.m}`, `${ansL}/${ansM}`);
      const odpL = el('odpUlL');
      if (odpL) { odpL.textContent = ansL; odpL.style.color = 'var(--czerwony)'; }
      const odpM = el('odpUlM');
      if (odpM) { odpM.textContent = ansM; odpM.style.color = 'var(--czerwony)'; }
    }
    
    setTimeout(() => { if (stan.gra) nastepnePytanie(); }, ok ? 160 : 1200);
  },

  ujawnij: function() {
    const odpL = el('odpUlL');
    if (odpL) { odpL.textContent = stan.pytanie.ansL; odpL.style.color = 'var(--zielony)'; }
    const odpM = el('odpUlM');
    if (odpM) { odpM.textContent = stan.pytanie.ansM; odpM.style.color = 'var(--zielony)'; }
    return { q: stan.pytanie.text, a: `${stan.pytanie.ansL}/${stan.pytanie.ansM}` };
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
      // ulamki don't use minus
    } else if (stan.buforDwa[f].length < 3) {
      stan.buforDwa[f] += akcja;
      this.odswiez();
    }
  },

  tab: function() {
    stan.aktywnePoleDwa = (stan.aktywnePoleDwa + 1) % 2; 
    etA[0].textContent = 'Licznik'; 
    etA[1].textContent = 'Mianownik';
    polaA[0].className = 'pole-odpowiedzi' + (stan.aktywnePoleDwa === 0 ? ' aktywny' : '');
    polaA[1].className = 'pole-odpowiedzi' + (stan.aktywnePoleDwa === 1 ? ' aktywny' : '');
    const t = el('tabyA').querySelectorAll('.tab-pola');
    t[0].classList.toggle('aktywny', stan.aktywnePoleDwa === 0);
    t[1].classList.toggle('aktywny', stan.aktywnePoleDwa === 1);
    this.odswiez();
  }
};
