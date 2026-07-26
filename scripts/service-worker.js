// Generated values are injected by generate-pwa.mjs.
const PRECACHE_MANIFEST = __PRECACHE_MANIFEST__;
const CACHE_VERSION = '__CACHE_VERSION__';
const PRECACHE_CONCURRENCY = 8;
const CACHE_PREFIX = 'classwiz-qr-precache-';
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const METADATA_URL = new URL('/__classwizqr_pwa_manifest__', self.location.origin).href;
const LEGACY_CACHE_NAME = `workbox-precache-v2-${self.registration.scope}`;
const REVISION_PARAM = '__pwa_revision__';

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
      const metadata = await metadataResponse.json();
      if (!Array.isArray(metadata.entries)) continue;
      reusable.push({
        cache,
        entries: new Map(metadata.entries.map(entry => [entry.url, entry])),
      });
    } catch {
      // Ignore incomplete or incompatible caches. They are removed after activation.
    }
  }

  return reusable;
}

function serializedCacheURL(url) {
  return url.origin === self.location.origin
    ? `${url.pathname}${url.search}`
    : url.href;
}

function createMetadataEntry(entry, sourceURL, finalURL, preserveSearch = false) {
  const metadataEntry = {
    revision: entry.revision,
    url: entry.url,
  };
  if (finalURL.href !== sourceURL.href) {
    metadataEntry.cacheURL = serializedCacheURL(finalURL);
    if (preserveSearch) metadataEntry.preserveSearch = true;
  }
  return metadataEntry;
}

async function copyUnchanged(entry, targetCache, sources) {
  for (const source of sources) {
    const previousEntry = source.entries.get(entry.url);
    if (previousEntry?.revision !== entry.revision) continue;

    const previousCacheURL = new URL(
      previousEntry.cacheURL || previousEntry.url,
      self.registration.scope,
    );
    const response = await source.cache.match(cacheRequest(previousCacheURL.href));
    if (!response) continue;

    await targetCache.put(
      cacheRequest(previousCacheURL.href),
      await withoutRedirect(response),
    );
    return { ...previousEntry };
  }

  return null;
}

async function fetchAndCache(entry, cache, sources) {
  const copiedEntry = await copyUnchanged(entry, cache, sources);
  if (copiedEntry) return copiedEntry;

  const resourceURL = new URL(entry.url, self.registration.scope);
  const fetchURL = new URL(resourceURL);
  fetchURL.searchParams.set(REVISION_PARAM, entry.revision || CACHE_VERSION);

  const response = await fetch(new Request(fetchURL, {
    cache: 'no-store',
    credentials: 'same-origin',
  }));
  if (!response.ok) {
    throw new Error(`Unable to precache ${entry.url}: HTTP ${response.status}`);
  }

  const finalURL = response.redirected
    ? new URL(response.url)
    : new URL(resourceURL);
  const preserveSearch = finalURL.searchParams.has(REVISION_PARAM);
  finalURL.searchParams.delete(REVISION_PARAM);
  finalURL.hash = '';

  await cache.put(
    cacheRequest(finalURL.href),
    await withoutRedirect(response),
  );
  return createMetadataEntry(entry, resourceURL, finalURL, preserveSearch);
}

async function installPrecache() {
  const cache = await caches.open(CACHE_NAME);
  const sources = await reusableCaches();
  const installedEntries = new Array(PRECACHE_MANIFEST.length);
  let nextIndex = 0;
  let failure;

  async function worker() {
    while (!failure) {
      const index = nextIndex++;
      if (index >= PRECACHE_MANIFEST.length) return;

      try {
        installedEntries[index] = await fetchAndCache(
          PRECACHE_MANIFEST[index],
          cache,
          sources,
        );
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
      new Response(JSON.stringify({ entries: installedEntries }), {
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  } catch (error) {
    // All workers have stopped before deletion, so an incomplete cache cannot reappear.
    await caches.delete(CACHE_NAME);
    throw error;
  }
}

let metadataPromise;

async function precacheMetadata() {
  metadataPromise ||= (async () => {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(METADATA_URL);
    const metadata = response ? await response.json() : { entries: [] };
    const bySource = new Map();
    const cachedURLs = new Set();

    for (const entry of metadata.entries || []) {
      const sourceURL = new URL(entry.url, self.registration.scope).href;
      const cacheURL = new URL(
        entry.cacheURL || entry.url,
        self.registration.scope,
      ).href;
      const record = { ...entry, cacheURL };
      bySource.set(sourceURL, record);
      cachedURLs.add(cacheURL);
    }

    return { bySource, cachedURLs };
  })();
  return metadataPromise;
}

function requestCandidates(requestURL) {
  const exactURL = new URL(requestURL);
  exactURL.hash = '';
  const withoutSearch = new URL(exactURL);
  withoutSearch.search = '';
  return exactURL.href === withoutSearch.href
    ? [exactURL.href]
    : [exactURL.href, withoutSearch.href];
}

async function matchPrecache(requestURL, metadata) {
  const { cachedURLs } = metadata || await precacheMetadata();
  const cachedURL = requestCandidates(requestURL)
    .find(candidate => cachedURLs.has(candidate));
  if (!cachedURL) return undefined;

  return caches.match(cacheRequest(cachedURL), { cacheName: CACHE_NAME });
}

function recordedRedirect(requestURL, metadata) {
  const sourceURL = new URL(requestURL);
  const requestSearch = sourceURL.search;
  sourceURL.search = '';
  sourceURL.hash = '';

  const entry = metadata.bySource.get(sourceURL.href);
  if (!entry || entry.cacheURL === sourceURL.href) return null;

  const targetURL = new URL(entry.cacheURL);
  if (entry.preserveSearch && requestSearch) {
    const searchParams = new URLSearchParams(requestSearch);
    for (const [name, value] of searchParams) {
      targetURL.searchParams.append(name, value);
    }
  }
  return targetURL.href;
}

async function navigateNetworkFirst(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const metadata = await precacheMetadata();
    const redirectURL = recordedRedirect(request.url, metadata);
    if (redirectURL) return Response.redirect(redirectURL, 308);

    const cached = await matchPrecache(request.url, metadata);
    if (cached) return cached;
    throw error;
  }
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

  if (event.request.mode === 'navigate') {
    event.respondWith(navigateNetworkFirst(event.request));
    return;
  }

  event.respondWith((async () => {
    const cached = await matchPrecache(requestURL);
    return cached || fetch(event.request);
  })());
});
