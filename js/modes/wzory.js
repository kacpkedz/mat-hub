
function ujawnijWzoryWew(stanPytanie) {
  const { a, b, typ, kier, odpowiedzi } = stanPytanie;
  const ax = a === 1 ? 'x' : `${zielony(a)}x`;

  let htmlPodpowiedzi = '';

  if (kier === 0) {
    if      (typ === 0) htmlPodpowiedzi = `(${ax} ${szary('+')} ${zielony(b)})<sup>2</sup>`;
    else if (typ === 1) htmlPodpowiedzi = `(${ax} ${szary('−')} ${zielony(b)})<sup>2</sup>`;
    else if (typ === 2) htmlPodpowiedzi = `(${ax} ${szary('+')} ${zielony(b)})(${ax} ${szary('−')} ${zielony(b)})`;
    else                htmlPodpowiedzi = `(x ${szary('+')} ${zielony(b)})<sup>3</sup>`;
  } else {
    const [w0, w1, w2] = odpowiedzi;
    if (typ === 0 || typ === 1) {
      const sg = typ === 0 ? '+' : '−';
      htmlPodpowiedzi = `${zielony(w0)}x<sup>2</sup> ${szary(sg)} ${zielony(w1)}x ${szary('+')} ${zielony(w2)}`;
    } else if (typ === 2) {
      htmlPodpowiedzi = `${zielony(w0)}x<sup>2</sup> ${szary('−')} ${zielony(w1)}`;
    } else {
      htmlPodpowiedzi = `x<sup>3</sup> ${szary('+')} ${zielony(w0)}x<sup>2</sup> ${szary('+')} ${zielony(w1)}x ${szary('+')} ${zielony(w2)}`;
    }
  }
  return htmlPodpowiedzi;
}

const modeWzory = {
  generuj: function() {
    const cfg  = POZIOMY[stan.poziom];
    const b    = losuj(2, Math.min(cfg.wzoryMax, 9));
    const typ  = losuj(0, stan.poziom === 'trudny' ? 3 : 2);  
    const kier = losuj(0, 1); 

    const mozliwoscA = (kier === 0) && (typ <= 2) && (stan.poziom !== 'latwy');
    const a = mozliwoscA ? losujZ([1, 1, 2, 3]) : 1;

    const a2   = a * a;
    const b2   = b * b;
    const ab2  = 2 * a * b;
    const ax   = a === 1 ? 'x' : `${a}x`;

    let rozniecie, skrocona, etykieta, odpowiedzi;

    if (typ === 0) {
      rozniecie = `${a2 === 1 ? 'x' : a2 + 'x'}<sup>2</sup> ${szary('+')} ${ab2}x ${szary('+')} ${b2}`;
      skrocona  = `(${ax} ${szary('+')} ${b})<sup>2</sup>`;
      etykieta  = '(ax+b)²';
      odpowiedzi = kier === 0 ? (a === 1 ? [b] : [a, b]) : [a2, ab2, b2];
    } else if (typ === 1) {
      rozniecie = `${a2 === 1 ? 'x' : a2 + 'x'}<sup>2</sup> ${szary('−')} ${ab2}x ${szary('+')} ${b2}`;
      skrocona  = `(${ax} ${szary('−')} ${b})<sup>2</sup>`;
      etykieta  = '(ax−b)²';
      odpowiedzi = kier === 0 ? (a === 1 ? [b] : [a, b]) : [a2, ab2, b2];
    } else if (typ === 2) {
      rozniecie = `${a2 === 1 ? 'x' : a2 + 'x'}<sup>2</sup> ${szary('−')} ${b2}`;
      skrocona  = `(${ax} ${szary('+')} ${b})(${ax} ${szary('−')} ${b})`;
      etykieta  = '(ax+b)(ax−b)';
      odpowiedzi = kier === 0 ? (a === 1 ? [b] : [a, b]) : [a2, b2];
    } else {
      const _3b = 3*b, _3b2 = 3*b2, b3 = b2*b;
      rozniecie = `x<sup>3</sup> ${szary('+')} ${_3b}x<sup>2</sup> ${szary('+')} ${_3b2}x ${szary('+')} ${b3}`;
      skrocona  = `(x ${szary('+')} ${b})<sup>3</sup>`;
      etykieta  = '(x+b)³';
      odpowiedzi = kier === 0 ? [b] : [_3b, _3b2, b3];
    }

    const etPol = kier === 0
      ? (odpowiedzi.length === 1 ? ['b'] : ['a', 'b'])
      : (odpowiedzi.length === 2 ? ['a²', 'b²'] : (typ === 3 ? ['3b', '3b²', 'b³'] : ['a²', '2ab', 'b²']));

    const rownanieHtml = kier === 0 ? rozniecie : skrocona;

    stan.pytanie = { a, b, typ, kier, odpowiedzi, etPol, text: rownanieHtml.replace(/<[^>]*>?/gm, '') };
    stan.buforTrzy = odpowiedzi.map(() => '');
    stan.aktywnePoleTrzy = 0;

    etykietaPytania.textContent = kier === 0 ? `złóż → ${etykieta}` : `rozpisz ${etykieta}`;
    el('pytanieWzor').innerHTML = rownanieHtml + ` ${bDb('= ?')}`;

    const n = odpowiedzi.length;
    polaB.forEach((p, i) => { p.style.display = i < n ? '' : 'none'; });
    el('sepB0').style.display = n >= 2 ? '' : 'none';
    el('sepB1').style.display = n >= 3 ? '' : 'none';

    const tabyB = el('tabyB').querySelectorAll('.tab-pola');
    tabyB.forEach((t, i) => { t.style.display = i < n ? '' : 'none'; t.textContent = etPol[i] || ''; });

    etPol.forEach((et, i) => { if (i < n) etB[i].textContent = et; });

    this.odswiez();
  },

  odswiez: function() {
    const { odpowiedzi, a, typ, kier } = stan.pytanie;
    const n = odpowiedzi.length;

    valB.forEach((v, i) => {
      if (i >= n) return;
      const wartosc = stan.buforTrzy[i];
      v.textContent = wartosc || '?';
      v.className = 'wartosc-pola' + (wartosc ? '' : ' placeholder');
    });

    const bv = i => stan.buforTrzy[i] || '?';
    
    if (kier === 0) {
      const bVal = n === 1 ? blank(bv(0), 'wz0') : blank(bv(1), 'wz1');
      const xPart = n >= 2 ? `${blank(bv(0), 'wz0')}x` : 'x';
      if      (typ === 0) el('podpowiedzWzor').innerHTML = `(${xPart} ${szary('+')} ${bVal})<sup>2</sup>`;
      else if (typ === 1) el('podpowiedzWzor').innerHTML = `(${xPart} ${szary('−')} ${bVal})<sup>2</sup>`;
      else if (typ === 2) el('podpowiedzWzor').innerHTML = `(${xPart} ${szary('+')} ${bVal})(${xPart} ${szary('−')} ${bVal})`;
      else                el('podpowiedzWzor').innerHTML = `(x ${szary('+')} ${blank(bv(0), 'wz0')})<sup>3</sup>`;
    } else {
      if (typ === 0 || typ === 1) {
        const sg = typ === 0 ? '+' : '−';
        el('podpowiedzWzor').innerHTML = `${blank(bv(0),'wz0')}x<sup>2</sup> ${szary(sg)} ${blank(bv(1),'wz1')}x ${szary('+')} ${blank(bv(2),'wz2')}`;
      } else if (typ === 2) {
        el('podpowiedzWzor').innerHTML = `${blank(bv(0),'wz0')}x<sup>2</sup> ${szary('−')} ${blank(bv(1),'wz1')}`;
      } else {
        el('podpowiedzWzor').innerHTML = `x<sup>3</sup> ${szary('+')} ${blank(bv(0),'wz0')}x<sup>2</sup> ${szary('+')} ${blank(bv(1),'wz1')}x ${szary('+')} ${blank(bv(2),'wz2')}`;
      }
    }

    polaB.forEach((p, i) => {
      p.className = 'pole-odpowiedzi' + (i === stan.aktywnePoleTrzy ? ' aktywny' : '');
    });
    el('tabyB').querySelectorAll('.tab-pola').forEach((t, i) => {
      t.classList.toggle('aktywny', i === stan.aktywnePoleTrzy);
    });
  },

  sprawdz: function() {
    const { odpowiedzi } = stan.pytanie;
    const wpisane = odpowiedzi.map((_, i) => parseInt(stan.buforTrzy[i]));
    if (wpisane.some(isNaN)) return;

    const ok = odpowiedzi.every((oczekiwane, i) => wpisane[i] === oczekiwane);

    if (ok) {
      trafiony();
    } else {
      const html = ujawnijWzoryWew(stan.pytanie);
      bledny(stan.pytanie.text, html.replace(/<[^>]*>?/gm, ''));
      el('podpowiedzWzor').innerHTML = html;
    }
    setTimeout(() => { if (stan.gra) nastepnePytanie(); }, ok ? 160 : 1400);
  },

  ujawnij: function() {
    const html = ujawnijWzoryWew(stan.pytanie);
    el('podpowiedzWzor').innerHTML = html;
    return { q: stan.pytanie.text, a: html.replace(/<[^>]*>?/gm, '') };
  },

  wcisnieto: function(akcja) {
    const f = stan.aktywnePoleTrzy;
    if (akcja === 'ok') { 
      this.sprawdz(); 
    } else if (akcja === 'skip') { 
      pominPytanie(); 
    } else if (akcja === 'clr') { 
      stan.buforTrzy[f] = ''; this.odswiez(); 
    } else if (akcja === 'del') { 
      stan.buforTrzy[f] = stan.buforTrzy[f].slice(0, -1); this.odswiez(); 
    } else if (akcja === '-') {
      // Wzory don't use minus key usually
    } else if (stan.buforTrzy[f].length < 4) {
      stan.buforTrzy[f] += akcja; 
      this.odswiez();
    }
  },

  tab: function() {
    if (stan.pytanie) {
      stan.aktywnePoleTrzy = (stan.aktywnePoleTrzy + 1) % stan.pytanie.odpowiedzi.length;
      this.odswiez();
    }
  }
};
