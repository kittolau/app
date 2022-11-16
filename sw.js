// Files to cache
const CURRENT_CACHE = 'kitto-app-v1';
const contentToCache = [
  './',
  './index.html',
  './icon/android-chrome-192x192.png',
  './icon/android-chrome-512x512.png',
  './icon/apple-touch-icon.png',
  './icon/favicon.ico'
];

self.addEventListener('activate', evt =>
  evt.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CURRENT_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  )
);


// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(CURRENT_CACHE);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  let isCachedUrl = contentToCache.find(cachedUrl => {
    let cachedUrlAbs = new URL(cachedUrl, self.location.origin).href

    if(e.request.url == cachedUrlAbs){
      console.log("[Service Worker] response cached: "+e.request.url);
      return cachedUrl
    }
  });
  if(isCachedUrl == null) return

  console.log("[Service Worker] skip cache: "+e.request.url);

  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(CURRENT_CACHE);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});
