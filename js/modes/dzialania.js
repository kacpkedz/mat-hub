
const modeDzialania = {
  generuj: function() {
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
      if (b > a) [a, b] = [b, a]; 
      odpowiedz = a - b;
    } else if (operator === '×') {
      a = losuj(1, cfg.mnozeniMax);
      b = losuj(1, cfg.mnozeniMax);
      odpowiedz = a * b;
    } else {
      b = losuj(2, cfg.dzielenieMax);
      odpowiedz = losuj(1, cfg.dzielenieMax);
      a = b * odpowiedz;
    }

    stan.pytanie = { odpowiedz, text: `${a} ${operator} ${b}` };
    stan.buforJeden = '';

    const nazwyOperatorow = { '+': 'Dodawanie', '−': 'Odejmowanie', '×': 'Mnożenie', '÷': 'Dzielenie' };
    etykietaPytania.textContent = nazwyOperatorow[operator];

    el('pytanieArytm').innerHTML =
      `${a}<span class="operator"> ${operator} </span>${b}` +
      `<span class="rowna-sie"> = </span>` +
      `<span id="odp">?</span>`;
  },

  odswiez: function() {
    const odp = el('odp');
    if (!odp) return;
    odp.textContent = stan.buforJeden || '?';
    odp.className = stan.buforJeden;
  },

  sprawdz: function() {
    const wpisane = parseInt(stan.buforJeden);
    if (isNaN(wpisane) || stan.buforJeden === '' || stan.buforJeden === '-') return;

    const byloDobrze = (wpisane === stan.pytanie.odpowiedz);

    if (byloDobrze) {
      trafiony();
    } else {
      bledny(`${stan.pytanie.text}`, `${stan.pytanie.odpowiedz}`);
      const odp = el('odp');
      if (odp) { odp.textContent = stan.pytanie.odpowiedz; odp.className = 'odpowiedz'; }
    }

    stan.buforJeden = '';
    if (byloDobrze) this.odswiez();
    
    setTimeout(() => { if (stan.gra) nastepnePytanie(); }, byloDobrze ? 100 : 950);
  },

  ujawnij: function() {
    const odp = el('odp');
    if (odp) { odp.textContent = stan.pytanie.odpowiedz; odp.className = 'odpowiedz'; }
    return { q: stan.pytanie.text, a: stan.pytanie.odpowiedz };
  },

  wcisnieto: function(akcja) {
    if (akcja === 'ok') {
      this.sprawdz();
    } else if (akcja === 'skip') {
      pominPytanie();
    } else if (akcja === 'clr') {
      stan.buforJeden = ''; 
      this.odswiez();
    } else if (akcja === 'del') {
      stan.buforJeden = stan.buforJeden.slice(0, -1); 
      this.odswiez();
    } else if (akcja === '-') {
      stan.buforJeden = zmienZnak(stan.buforJeden); 
      this.odswiez();
    } else if (stan.buforJeden.replace('-', '').length < 4) {
      stan.buforJeden += akcja; 
      this.odswiez();
    }
  }
};
