// Bump this on every release so clients discard stale data/shell.
const CACHE_VERSION = 'grutto-pass-v126';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const TILE_CACHE = `${CACHE_VERSION}-tiles`;
const APP_SHELL = new URL('./index.html', self.registration.scope).toString();

const SHELL_ASSETS = [
  './index.html',
  './manifest.json',
  './i18n/ui.js',
  './config.js',
  './data/facilities.js',
  './data/facility-corrections.js',
  './data/facility-brochure.js',
  './data/facility-summaries.js',
  './data/facility-access-presentation.js',
  './data/exhibition-meta.js',
  './exhibition-meta-runtime.js',
  './data/exhibition-links.js',
  './data/i18n/facilities.en.js',
  './data/i18n/facilities.zh.js',
  './data/search-aliases.js',
  './data/facility-pass-benefits.js',
  './data/facility-legacy-risk.js',
  './data/facility-official-sources.js',
  './official-source-runtime.js',
  './data/facility-pass-time-scope.js',
  './pass-time-scope-runtime.js',
  './data/holidays.js',
  './coords.js',
  './status.js',
  './map.js',
  './facility-presentation-model.js',
  './phase1/hours.js',
  './phase1/phase1-open-now.js',
  './phase2/phase2-nearby.js',
  './vendor/leaflet/leaflet.js',
  './vendor/leaflet/leaflet.css',
  './vendor/leaflet.markercluster/leaflet.markercluster.js',
  './vendor/leaflet.markercluster/MarkerCluster.css',
  './favicon.svg',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './assets/brand/pyoko-symbol-192.png',
  './assets/brand/pyoko-symbol-512.png'
];

const MAX_TILE_ENTRIES = 80;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('grutto-pass-') && ![SHELL_CACHE, TILE_CACHE].includes(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function isMapTile(url) {
  return url.hostname.endsWith('.tile.openstreetmap.org');
}

async function cacheResponse(cacheName, request, response, maxEntries) {
  if (!response || (!response.ok && response.type !== 'opaque')) return response;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());

  if (maxEntries) {
    const keys = await cache.keys();
    const staleKeys = keys.slice(0, Math.max(0, keys.length - maxEntries));
    await Promise.all(staleKeys.map(key => cache.delete(key)));
  }
  return response;
}

async function networkFirst(request, fallbackUrl = request) {
  try {
    const response = await fetch(request);
    if (response.ok) await cacheResponse(SHELL_CACHE, request, response);
    return response;
  } catch {
    return caches.match(fallbackUrl);
  }
}

async function runtimeCacheFirst(request, cacheName, maxEntries) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    return cacheResponse(cacheName, request, response, maxEntries);
  } catch {
    return Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, APP_SHELL));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isMapTile(url)) {
    event.respondWith(runtimeCacheFirst(request, TILE_CACHE, MAX_TILE_ENTRIES));
  }
});
