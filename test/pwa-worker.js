import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
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
  let claimed = false;
  const self = {
    location: { origin },
    registration: { scope },
    clients: {
      async claim() {
        claimed = true;
      },
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    skipWaiting: async () => {},
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
    const response = new Response(request.url);
    if (new URL(request.url).pathname === '/asset-0.js') {
      Object.defineProperty(response, 'redirected', { value: true });
    }
    return response;
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
  assert.equal(
    caches.stores.get('classwiz-qr-precache-cache-v1').responses.size,
    initialEntries.length + 1,
  );
  assert.equal(
    (await caches.stores
      .get('classwiz-qr-precache-cache-v1')
      .match(`${origin}/asset-0.js`))
      .redirected,
    false,
    'Redirected network responses must be stored as regular responses.',
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

  await updatedWorker.dispatch('activate');
  assert.deepEqual(await caches.keys(), ['classwiz-qr-precache-cache-v2']);
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
  assert.deepEqual(
    await caches.keys(),
    ['classwiz-qr-precache-cache-v2'],
    'A failed update must leave the active cache untouched.',
  );
});
