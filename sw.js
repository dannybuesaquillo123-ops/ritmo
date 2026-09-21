const CACHE = 'ritmo-v2';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/ritmo/', '/ritmo/index.html', '/ritmo/manifest.json', '/ritmo/icon-192.png', '/ritmo/icon-512.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).then(r => {
    const copia = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request)));
});
