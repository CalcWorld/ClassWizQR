// Development-only service worker.
// The production build replaces dist/sw.js with the generated precache worker.

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(names => Promise.all(names.map(name => caches.delete(name)))),
    ]),
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request, { cache: 'no-store' }));
});
