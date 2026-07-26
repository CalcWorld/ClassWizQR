// Generated values are injected by generate-pwa.mjs.
const PRECACHE_MANIFEST = __PRECACHE_MANIFEST__;
const CACHE_VERSION = '__CACHE_VERSION__';
const PRECACHE_CONCURRENCY = 8;
const CACHE_PREFIX = 'classwiz-qr-precache-';
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const METADATA_URL = new URL('/__classwizqr_pwa_manifest__', self.location.origin).href;
const LEGACY_CACHE_NAME = `workbox-precache-v2-${self.registration.scope}`;

const precachedURLs = new Set(
  PRECACHE_MANIFEST.map(entry => (
    new URL(entry.url, self.registration.scope).href
  )),
);

function cacheRequest(url) {
  return new Request(url, { credentials: 'same-origin' });
}

async function withoutRedirect(response) {
  if (!response.redirected) return response;

  const clone = response.clone();
  const init = {
    headers: new Headers(clone.headers),
    status: clone.status,
    statusText: clone.statusText,
  };

  try {
    return new Response(clone.body, init);
  } catch {
    return new Response(await response.blob(), init);
  }
}

async function reusableCaches() {
  const cacheNames = await caches.keys();
  const reusable = [];

  for (const name of cacheNames) {
    if (!name.startsWith(CACHE_PREFIX) || name === CACHE_NAME) continue;

    const cache = await caches.open(name);
    const metadataResponse = await cache.match(METADATA_URL);
    if (!metadataResponse) continue;

    try {
      const entries = await metadataResponse.json();
      reusable.push({
        cache,
        revisions: new Map(entries.map(entry => [entry.url, entry.revision])),
      });
    } catch {
      // Ignore incomplete or incompatible caches. They are removed after activation.
    }
  }

  return reusable;
}

async function copyUnchanged(entry, targetCache, sources) {
  for (const source of sources) {
    if (source.revisions.get(entry.url) !== entry.revision) continue;

    const response = await source.cache.match(cacheRequest(
      new URL(entry.url, self.registration.scope).href,
    ));
    if (!response) continue;

    await targetCache.put(
      cacheRequest(new URL(entry.url, self.registration.scope).href),
      await withoutRedirect(response),
    );
    return true;
  }

  return false;
}

async function fetchAndCache(entry, cache, sources) {
  if (await copyUnchanged(entry, cache, sources)) return;

  const resourceURL = new URL(entry.url, self.registration.scope);
  const fetchURL = new URL(resourceURL);
  fetchURL.searchParams.set('__pwa_revision__', entry.revision || CACHE_VERSION);

  const response = await fetch(new Request(fetchURL, {
    cache: 'no-store',
    credentials: 'same-origin',
  }));
  if (!response.ok) {
    throw new Error(`Unable to precache ${entry.url}: HTTP ${response.status}`);
  }

  await cache.put(
    cacheRequest(resourceURL.href),
    await withoutRedirect(response),
  );
}

async function installPrecache() {
  const cache = await caches.open(CACHE_NAME);
  const sources = await reusableCaches();
  let nextIndex = 0;
  let failure;

  async function worker() {
    while (!failure) {
      const index = nextIndex++;
      if (index >= PRECACHE_MANIFEST.length) return;

      try {
        await fetchAndCache(PRECACHE_MANIFEST[index], cache, sources);
      } catch (error) {
        failure ||= error;
      }
    }
  }

  try {
    await Promise.all(
      Array.from({ length: PRECACHE_CONCURRENCY }, () => worker()),
    );
    if (failure) throw failure;

    await cache.put(
      METADATA_URL,
      new Response(JSON.stringify(PRECACHE_MANIFEST), {
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  } catch (error) {
    // All workers have stopped before deletion, so an incomplete cache cannot reappear.
    await caches.delete(CACHE_NAME);
    throw error;
  }
}

function precachedURL(requestURL) {
  const exactURL = new URL(requestURL);
  exactURL.hash = '';
  if (precachedURLs.has(exactURL.href)) return exactURL.href;

  exactURL.search = '';
  if (precachedURLs.has(exactURL.href)) return exactURL.href;

  if (exactURL.pathname.endsWith('/')) {
    const directoryIndex = new URL(exactURL);
    directoryIndex.pathname += 'index.html';
    if (precachedURLs.has(directoryIndex.href)) return directoryIndex.href;
  }

  if (!exactURL.pathname.split('/').pop().includes('.')) {
    const cleanURL = new URL(exactURL);
    cleanURL.pathname += '.html';
    if (precachedURLs.has(cleanURL.href)) return cleanURL.href;
  }

  return null;
}

self.addEventListener('install', event => {
  event.waitUntil(installPrecache());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => (
          (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          || name === LEGACY_CACHE_NAME
        ))
        .map(name => caches.delete(name)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== self.location.origin) return;

  const cachedURL = precachedURL(requestURL);
  if (!cachedURL) return;

  event.respondWith((async () => {
    const cached = await caches.match(cacheRequest(cachedURL), {
      cacheName: CACHE_NAME,
    });
    return cached || fetch(event.request);
  })());
});
