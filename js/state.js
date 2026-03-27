// ===========================================
// KONFIGURACJA POZIOMÓW TRUDNOŚCI
// ===========================================

const POZIOMY = {
  latwy: {
    dzialanieMax: 12,      
    mnozeniMax:   10,      
    dzielenieMax: 10,      
    rozkladMax:   5,       
    wspolczynniki: [1],    
    ujemneRzerwiastki: false, 
    podwojnyPierwiastek: false, 
    wzoryMax:     5,       
    pitagorasMax: 15,
    ulamkiMax:    10,
    procentyTypy: ['latwe']
  },
  sredni: {
    dzialanieMax: 30,
    mnozeniMax:   12,
    dzielenieMax: 12,
    rozkladMax:   7,
    wspolczynniki: [1, 2],
    ujemneRzerwiastki: true,
    podwojnyPierwiastek: false,
    wzoryMax:     8,
    pitagorasMax: 20,
    ulamkiMax:    25,
    procentyTypy: ['latwe', 'srednie']
  },
  trudny: {
    dzialanieMax: 50,
    mnozeniMax:   15,
    dzielenieMax: 15,
    rozkladMax:   10,
    wspolczynniki: [1, 2, 3],
    ujemneRzerwiastki: true,
    podwojnyPierwiastek: true,
    wzoryMax:     12,
    pitagorasMax: 30,
    ulamkiMax:    50,
    procentyTypy: ['srednie', 'trudne', 'odwrotne']
  },
};

// ===========================================
// STAN GRY
// ===========================================

// Profile z przeglądarki
const domyslnyGracz = localStorage.getItem('matHub_ostatniGracz') || 'Gość';

const stan = {
  // Postęp sesji
  punkty:      0,
  streak:      0,   
  maxStreak:   0,   
  poprawne:    0,
  bledne:      0,
  mnoznikKombo: 1,  

  // Statystyki spięte z kontem LocalStorage
  gracz: domyslnyGracz,
  maxPunktyZapisane: parseInt(localStorage.getItem(`matHub_maxPkt_${domyslnyGracz}`)) || 0,
  maxComboZapisane:  parseInt(localStorage.getItem(`matHub_maxCmb_${domyslnyGracz}`)) || 0,
  
  historiaBledow: [], 

  // Ustawienia menu
  poziom:      'latwy',
  aktywneOperatory: ['+', '−', '×', '÷'],
  aktywneTypy:      ['dzialania', 'rozklad', 'wzory', 'pitagoras', 'ulamki', 'procenty'],

  // Aktualne Pytanie
  trybGry:   'dzialania', 
  pytanie:   null,        
  gra:       false,       

  buforJeden:  '',            
  buforDwa:    ['', ''],      
  aktywnePoleDwa: 0,          
  buforTrzy:   ['', '', ''],  
  aktywnePoleTrzy: 0,         
};

function zalogujProfil(imie) {
  const nowyWpis = imie.trim() || 'Gość';
  stan.gracz = nowyWpis;
  localStorage.setItem('matHub_ostatniGracz', nowyWpis);
  stan.maxPunktyZapisane = parseInt(localStorage.getItem(`matHub_maxPkt_${nowyWpis}`)) || 0;
  stan.maxComboZapisane = parseInt(localStorage.getItem(`matHub_maxCmb_${nowyWpis}`)) || 0;
}

function zapiszProfil() {
  localStorage.setItem(`matHub_maxPkt_${stan.gracz}`, stan.maxPunktyZapisane);
  localStorage.setItem(`matHub_maxCmb_${stan.gracz}`, stan.maxComboZapisane);
}
