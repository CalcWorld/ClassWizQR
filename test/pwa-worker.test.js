import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'vitest';
import vm from 'node:vm';

const origin = 'https://classwiz.test';
const scope = `${origin}/`;
const template = await readFile('scripts/service-worker.js', 'utf8');

function requestURL(request) {
  return typeof request === 'string'
    ? new URL(request, scope).href
    : request.url;
}

function createCacheStorage() {
  const stores = new Map();

  return {
    stores,
    async delete(name) {
      return stores.delete(name);
    },
    async keys() {
      return [...stores.keys()];
    },
    async match(request, { cacheName } = {}) {
      if (cacheName) return (await this.open(cacheName)).match(request);
      for (const cache of stores.values()) {
        const response = await cache.match(request);
        if (response) return response;
      }
    },
    async open(name) {
      if (!stores.has(name)) {
        const responses = new Map();
        stores.set(name, {
          responses,
          async match(request) {
            return responses.get(requestURL(request))?.clone();
          },
          async put(request, response) {
            responses.set(requestURL(request), response.clone());
          },
        });
      }
      return stores.get(name);
    },
  };
}

function compileWorker(entries, version) {
  return template
    .replace('__PRECACHE_MANIFEST__', JSON.stringify(entries))
    .replace('__CACHE_VERSION__', version);
}

function loadWorker({ caches, entries, fetch, version }) {
  const listeners = new Map();
  const messages = [];
  let claimed = false;
  const self = {
    location: { origin },
    registration: { scope },
    clients: {
      async claim() {
        claimed = true;
      },
      async matchAll() {
        return [{
          postMessage(message) {
            messages.push(message);
          },
        }];
      },
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    skipWaiting: async () => {
    },
  };

  vm.runInNewContext(compileWorker(entries, version), {
    Array,
    Error,
    Headers,
    JSON,
    Map,
    Promise,
    Request,
    Response,
    Set,
    URL,
    URLSearchParams,
    caches,
    fetch,
    self,
  });

  async function dispatch(type, extra = {}) {
    let completion;
    listeners.get(type)({
      ...extra,
      waitUntil(promise) {
        completion = promise;
      },
    });
    return completion;
  }

  return {
    dispatch,
    messages,
    async dispatchFetch(url, mode = 'cors') {
      let response;
      const request = new Request(url);
      Object.defineProperty(request, 'mode', { value: mode });
      listeners.get('fetch')({
        request,
        respondWith(promise) {
          response = promise;
        },
      });
      return response;
    },
    wasClaimed: () => claimed,
  };
}

function entries(revisions) {
  return revisions.map((revision, index) => ({
    revision,
    url: `asset-${index}.js`,
  }));
}

test('production service worker limits fetches and atomically reuses caches', async () => {
  const caches = createCacheStorage();
  const initialEntries = entries(Array.from({ length: 20 }, () => 'v1'));
  let activeFetches = 0;
  let maximumFetches = 0;
  let fetchCount = 0;

  const fetch = async request => {
    fetchCount++;
    activeFetches++;
    maximumFetches = Math.max(maximumFetches, activeFetches);
    await new Promise(resolve => setTimeout(resolve, 2));
    activeFetches--;
    return new Response(request.url);
  };

  const initialWorker = loadWorker({
    caches,
    entries: initialEntries,
    fetch,
    version: 'cache-v1',
  });
  await initialWorker.dispatch('install');

  assert.equal(fetchCount, initialEntries.length);
  assert.equal(maximumFetches, 8);
  const initialProgress = initialWorker.messages
    .filter(message => message.type === 'PRECACHE_PROGRESS');
  assert.equal(initialProgress[0].completed, 0);
  assert.equal(initialProgress[0].total, initialEntries.length);
  assert.equal(initialProgress.at(-1).completed, initialEntries.length);
  assert.equal(initialWorker.messages.at(-1).type, 'PRECACHE_COMPLETE');
  assert.equal(
    caches.stores.get('classwiz-qr-precache-cache-v1').responses.size,
    initialEntries.length + 1,
  );
  const updatedEntries = entries(['v2', ...Array.from({ length: 19 }, () => 'v1')]);
  fetchCount = 0;
  const updatedWorker = loadWorker({
    caches,
    entries: updatedEntries,
    fetch,
    version: 'cache-v2',
  });
  await updatedWorker.dispatch('install');

  assert.equal(fetchCount, 1, 'Only the changed resource should be downloaded.');
  assert.deepEqual(
    await caches.keys(),
    [
      'classwiz-qr-precache-cache-v1',
      'classwiz-qr-precache-cache-v2',
    ],
  );

  await caches.open(`workbox-precache-v2-${scope}`);
  await caches.open('workbox-precache-v2-https://another-app.test/');
  await updatedWorker.dispatch('activate');
  assert.deepEqual(
    await caches.keys(),
    [
      'classwiz-qr-precache-cache-v2',
      'workbox-precache-v2-https://another-app.test/',
    ],
  );
  assert.equal(updatedWorker.wasClaimed(), true);

  const failedEntries = entries(['v3', ...Array.from({ length: 19 }, () => 'v1')]);
  const failedWorker = loadWorker({
    caches,
    entries: failedEntries,
    fetch: async request => (
      new URL(request.url).pathname === '/asset-0.js'
        ? new Response('', { status: 503 })
        : fetch(request)
    ),
    version: 'cache-v3',
  });

  await assert.rejects(
    failedWorker.dispatch('install'),
    /Unable to precache asset-0\.js: HTTP 503/,
  );
  assert.equal(failedWorker.messages.at(-1).type, 'PRECACHE_FAILED');
  assert.deepEqual(
    await caches.keys(),
    [
      'classwiz-qr-precache-cache-v2',
      'workbox-precache-v2-https://another-app.test/',
    ],
    'A failed update must leave the active cache untouched.',
  );
});

test('production service worker serves cached navigations and preserves clean HTML redirects', async () => {
  const caches = createCacheStorage();
  let online = true;
  let navigationFetches = 0;
  const worker = loadWorker({
    caches,
    entries: [
      { revision: 'index', url: 'index.html' },
      { revision: 'api', url: 'api.html' },
    ],
    fetch: async request => {
      if (!online) throw new TypeError('Network unavailable');
      const requestURL = new URL(request.url);
      if (request.mode === 'navigate') navigationFetches++;
      if (request.mode !== 'navigate' && requestURL.pathname.endsWith('.html')) {
        const finalPath = requestURL.pathname === '/index.html' ? '/' : '/api';
        const response = new Response(request.url);
        Object.defineProperties(response, {
          redirected: { value: true },
          url: {
            value: `${origin}${finalPath}?__pwa_revision__=${
              requestURL.searchParams.get('__pwa_revision__')
            }`,
          },
        });
        return response;
      }
      return new Response(request.url);
    },
    version: 'clean-urls',
  });
  await worker.dispatch('install');

  const cache = caches.stores.get('classwiz-qr-precache-clean-urls');
  assert.equal(cache.responses.has(`${origin}/api`), true);
  assert.equal(cache.responses.has(`${origin}/api.html`), false);
  assert.equal(cache.responses.has(`${origin}/`), true);

  const cachedRedirect = await worker.dispatchFetch(
    `${origin}/api.html?lang=zh`,
    'navigate',
  );
  assert.equal(cachedRedirect.status, 308);
  assert.equal(cachedRedirect.headers.get('Location'), `${origin}/api?lang=zh`);

  const cachedPage = await worker.dispatchFetch(`${origin}/api`, 'navigate');
  assert.equal(cachedPage.status, 200);
  assert.equal(navigationFetches, 0, 'Cached navigations must not reach the network.');

  const uncachedPage = await worker.dispatchFetch(`${origin}/uncached`, 'navigate');
  assert.equal(uncachedPage.status, 200);
  assert.equal(navigationFetches, 1, 'Uncached navigations must fall back to the network.');

  online = false;
  const updatedWorker = loadWorker({
    caches,
    entries: [
      { revision: 'index', url: 'index.html' },
      { revision: 'api', url: 'api.html' },
    ],
    fetch: async () => {
      throw new TypeError('Network unavailable');
    },
    version: 'clean-urls-v2',
  });
  await updatedWorker.dispatch('install');

  const apiRedirect = await updatedWorker.dispatchFetch(
    `${origin}/api.html?lang=zh`,
    'navigate',
  );
  assert.equal(apiRedirect.status, 308);
  assert.equal(apiRedirect.headers.get('Location'), `${origin}/api?lang=zh`);

  const indexRedirect = await updatedWorker.dispatchFetch(
    `${origin}/index.html`,
    'navigate',
  );
  assert.equal(indexRedirect.status, 308);
  assert.equal(indexRedirect.headers.get('Location'), `${origin}/`);

  const cleanPage = await updatedWorker.dispatchFetch(`${origin}/api`, 'navigate');
  assert.equal(cleanPage.status, 200);
});

test('production service worker does not invent redirects', async () => {
  const caches = createCacheStorage();
  let online = true;
  const worker = loadWorker({
    caches,
    entries: [{ revision: 'api', url: 'api.html' }],
    fetch: async request => {
      if (!online) throw new TypeError('Network unavailable');
      return new Response(request.url);
    },
    version: 'plain-html',
  });
  await worker.dispatch('install');

  online = false;
  const response = await worker.dispatchFetch(`${origin}/api.html`, 'navigate');
  assert.equal(response.status, 200);
});
