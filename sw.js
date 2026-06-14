const CACHE = 'entretien-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=DM+Sans:wght@400;500;700&display=swap',
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  // Réseau d'abord pour les requêtes, cache en fallback
  e.respondWith(
    fetch(e.request).then(res=>{
      if(res.ok && e.request.method==='GET'){
        const clone = res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, clone));
      }
      return res;
    }).catch(()=>caches.match(e.request))
  );
});
