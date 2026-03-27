const CACHE_NAME = 'mat-hub-v7';

self.addEventListener('install', event => {
  self.skipWaiting(); // Natychmiastowa aktywacja nowego pliku SW
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  // STRATEGIA NETWORK-FIRST (Dla deweloperów i częstych aktualizacji na Github Pages)
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Zapisanie świeżego pliku do pamięci offline zaraz po jego poprawnym zaciągnięciu
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Fallback do zbuforowanych na urządzeniu plików JEDYNIE podczas totalnego braku neta po stronie użytkownika
        return caches.match(event.request);
      })
  );
});
