const CACHE = 'ritmo-v5';
const ARCHIVOS = ['/ritmo/', '/ritmo/index.html', '/ritmo/manifest.json', '/ritmo/icon-192.png', '/ritmo/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Abre siempre desde el teléfono; si hay internet, actualiza en segundo plano para la próxima vez.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(cache =>
    cache.match(e.request, { ignoreSearch: true }).then(guardado => {
      const red = fetch(e.request).then(r => {
        if (r && r.ok) cache.put(e.request, r.clone());
        return r;
      }).catch(() => null);
      if (guardado) { e.waitUntil(red); return guardado; }
      return red.then(r => r || (e.request.mode === 'navigate' ? cache.match('/ritmo/') : Response.error()));
    })
  ));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('/ritmo/');
  }));
});
