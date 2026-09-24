/**
 * HAKKIVEDA Progressive Web App - Production Service Worker
 * Version: 1.0.0
 * 
 * Rules:
 * - Cache static assets & app shell
 * - Do NOT cache sensitive checkout, payment, or auth responses
 * - Network-first for dynamic API data with offline fallback
 * - Stale-while-revalidate for images & static assets
 * - Safe versioned cache invalidation
 */

const CACHE_VERSION = 'hakkiveda-v1.0.0';
const SHELL_CACHE = `hakkiveda-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `hakkiveda-static-${CACHE_VERSION}`;
const DATA_CACHE = `hakkiveda-data-${CACHE_VERSION}`;

const CURRENT_CACHES = [SHELL_CACHE, STATIC_CACHE, DATA_CACHE];

// Core App Shell Assets
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
];

// Sensitive paths that must NEVER be cached
const SENSITIVE_PATH_PATTERNS = [
  /\/api\/admin/i,
  /\/api\/auth/i,
  /\/api\/customer/i,
  /\/api\/checkout/i,
  /\/api\/payment/i,
  /\/api\/razorpay/i,
  /\/api\/orders/i,
  /\/api\/shiprocket/i,
  /\/api\/uploads/i,
];

// Install: precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_ASSETS);
      } catch (err) {
        console.warn('[HAKKIVEDA PWA SW] Precache warning:', err);
      }
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!CURRENT_CACHES.includes(key) && key.startsWith('hakkiveda-')) {
            console.log('[HAKKIVEDA PWA SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Determine if URL is a sensitive endpoint
function isSensitiveUrl(url) {
  return SENSITIVE_PATH_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

// Helper: Determine if request is for a static asset
function isStaticAsset(url) {
  return (
    url.pathname.match(/\.(js|css|woff2?|ttf|eot|ico|png|jpe?g|gif|webp|svg)$/i) ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/assets/')
  );
}

// Fetch handler
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Never intercept non-GET requests (POST, PUT, DELETE - checkout, orders, logins, payments)
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 1. Completely bypass cache for sensitive authentication, checkout, and payment endpoints
  if (isSensitiveUrl(url)) {
    event.respondWith(fetch(request));
    return;
  }

  // 2. HTML navigation requests (App Shell) -> Network First with cached fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const shellFallback = await caches.match('/index.html');
          return shellFallback || new Response('Offline: HAKKIVEDA will reload when connection is restored.', {
            status: 503,
            headers: { 'Content-Type': 'text/html' },
          });
        })
    );
    return;
  }

  // 3. Static Assets (Scripts, CSS, Images, Fonts) -> Stale While Revalidate
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failure: cached response is the only fallback
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. Non-sensitive GET API Data (e.g., store public data, catalog) -> Network First with data cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response(JSON.stringify({
            success: false,
            offline: true,
            message: 'You are currently offline. Cached catalog may be unavailable.',
          }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// Handle incoming messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
