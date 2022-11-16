// Files to cache
const cacheName = 'kitto-app-v2';
const contentToCache = [
  './',
  './index.html',
  './icon/android-chrome-192x192.png',
  './icon/android-chrome-512x512.png',
  './icon/apple-touch-icon.png',
  './icon/favicon.ico'
];

// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  let isCachedUrl = contentToCache.find(cachedUrl => {
    let cachedUrlAbs = new URL(cachedUrl, self.location.origin).href

    if(e.request.url == cachedUrlAbs) return cachedUrl
  });
  if(isCachedUrl == null) return


  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});
