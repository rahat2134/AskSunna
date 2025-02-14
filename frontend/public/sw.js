const CACHE_NAME = 'asksunna-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/islamic-pattern.svg',
  '/app-icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Skip certain requests
  if (event.request.url.includes('plausible.io') || 
      event.request.url.includes('fonts.googleapis.com') || 
      event.request.url.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch new version
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and fetch fail, show offline page or fallback
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

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});