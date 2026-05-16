self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Basic pass-through service worker
  e.respondWith(fetch(e.request));
});
