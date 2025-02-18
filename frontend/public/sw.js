const CACHE_NAME = 'asksunna-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/islamic-pattern.svg',
  '/app-icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  // Immediately take control
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Take control of all clients
      clients.claim(),
      // Remove old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
    ])
  );
});

self.addEventListener('fetch', event => {
  // Skip analytics, fonts, and chrome-extension requests
  if (event.request.url.includes('plausible.io') || 
      event.request.url.includes('fonts.googleapis.com') || 
      event.request.url.includes('fonts.gstatic.com') ||
      event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Only cache requests from our domain
            if (!response || response.status !== 200 || 
                !event.request.url.startsWith(self.location.origin)) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });
            return response;
          });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('', {
          status: 404,
          statusText: 'Not Found'
        });
      })
  );
});