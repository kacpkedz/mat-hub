const VER = 'ma-v3';
const ASSETS = ['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(VER).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==VER).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  // tylko GET, tylko same-origin lub assets
  if (e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if (cached) return cached;
      return fetch(e.request).then(res=>{
        if (!res || res.status!==200 || res.type==='opaque') return res;
        const clone = res.clone();
        caches.open(VER).then(c=>c.put(e.request,clone));
        return res;
      }).catch(()=>caches.match('./index.html'));
    })
  );
});
