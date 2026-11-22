/* BROCÉLIANDE — service worker (appli installable + secours hors ligne)
   Stratégie « réseau d'abord » : les mises à jour du site sont toujours prises en compte. */
const CACHE = 'utmb-broceliande-v3.5.0';
const BASE = [
  './', 'index.html', 'style.css?v=3.5.0', 'app.js?v=3.5.0', 'i18n.js?v=3.5.0',
  'config.js?v=3.5.0', 'cover.js?v=3.5.0', 'manifest.webmanifest',
  'icons/icon-192.png', 'assets/brand/logo-broceliande-nature.webp',
  'assets/cover/cover-desktop.webp', 'assets/cover/cover-tablet.webp', 'assets/cover/cover-mobile.webp',
  'assets/cover/cover-main-v333.png',
  'assets/book/page-vierge.webp', 'assets/book/page-vierge-gauche.webp',
  'assets/map/carte-broceliande.webp'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  }).catch(() => caches.match(req).then(m => m || caches.match('index.html'))));
});
