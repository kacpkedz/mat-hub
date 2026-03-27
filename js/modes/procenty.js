const modeProcenty = {
  generuj: function() {
    const cfg = POZIOMY[stan.poziom];
    const typ = losujZ(cfg.procentyTypy); 
    
    let p, x, ans, str;

    if (typ === 'latwe') {
      p = losujZ([10, 20, 25, 50, 100]);
      if (p === 25) {
        x = losuj(1, 10) * 4; 
      } else {
        x = losuj(1, 10) * 10;
      }
      ans = (p / 100) * x;
      str = `${p}% z ${x} = `;
    } else if (typ === 'srednie') {
      p = losujZ([5, 15, 30, 40, 60, 75]);
      if (p % 25 === 0) x = losuj(2, 20) * 4;
      else if (p % 10 === 0) x = losuj(2, 10) * 5;
      else x = losuj(2, 15) * 20;
      ans = (p / 100) * x;
      str = `${p}% z ${x} = `;
    } else if (typ === 'trudne') {
      p = losujZ([2, 4, 8, 12, 35, 45, 99]);
      if (p === 99 || p === 2 || p === 4) x = losuj(1, 5) * 50;
      else x = losuj(1, 5) * 100;
      ans = (p / 100) * x;
      str = `${p}% z ${x} = `;
    } else { 
      // odwrotne np: Jaką cyfrą jest x, jeśli 25% tego x to 20? 
      p = losujZ([10, 20, 25, 50]);
      ans = losuj(2, 12) * 10; 
      x = (p / 100) * ans; 
      str = `${p}% z x ${bDb('=')} ${x} <br><div style="font-size:20px;color:var(--tekst3);margin-top:20px;">x = </div>`;
    }

    stan.pytanie = { p, x, ans, text: str.replace(/<[^>]*>?/gm, '') };
    stan.buforJeden = '';

    etykietaPytania.textContent = typ === 'odwrotne' ? 'Znajdź wartość (baza dla procentu)' : 'Oblicz procent z liczby';
    el('pytanieProcenty').innerHTML = `<div style="font-size: clamp(22px, 8vw, 38px); line-height: 1.2;">${str}<span id="odpProc" class="placeholder">?</span></div>`;
  },
  
  odswiez: function() {
    const odp = el('odpProc');
    if (!odp) return;
    odp.textContent = stan.buforJeden || '?';
    odp.style.color = stan.buforJeden ? 'var(--tekst1)' : '';
    odp.className = stan.buforJeden ? '' : 'placeholder';
  },

  sprawdz: function() {
    const wpisane = parseInt(stan.buforJeden);
    if (isNaN(wpisane) || stan.buforJeden === '' || stan.buforJeden === '-') return;

    const ok = (wpisane === stan.pytanie.ans);

    if (ok) {
      trafiony();
    } else {
      bledny(stan.pytanie.text, `${stan.pytanie.ans}`);
      const odp = el('odpProc');
      if (odp) { odp.textContent = stan.pytanie.ans; odp.style.color = 'var(--zielony)'; odp.className = ''; }
    }

    stan.buforJeden = '';
    if (ok) this.odswiez();
    
    setTimeout(() => { if (stan.gra) nastepnePytanie(); }, ok ? 100 : 1100);
  },

  ujawnij: function() {
    const odp = el('odpProc');
    if (odp) { odp.textContent = stan.pytanie.ans; odp.style.color = 'var(--zielony)'; odp.className = ''; }
    return { q: stan.pytanie.text, a: stan.pytanie.ans };
  },

  wcisnieto: function(akcja) {
    if (akcja === 'ok') {
      this.sprawdz();
    } else if (akcja === 'skip') {
      pominPytanie();
    } else if (akcja === 'clr') {
      stan.buforJeden = ''; this.odswiez();
    } else if (akcja === 'del') {
      stan.buforJeden = stan.buforJeden.slice(0, -1); this.odswiez();
    } else if (akcja === '-') {
      // none
    } else if (stan.buforJeden.replace('-', '').length < 4) {
      stan.buforJeden += akcja; this.odswiez();
    }
  }
};
