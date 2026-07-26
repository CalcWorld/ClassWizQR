import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';

const requiredFiles = [
  'dist/index.html',
  'dist/api.html',
  'dist/404.html',
  'dist/cwqr.js',
  'dist/cwqr.cjs',
  'dist/cwqr.mjs',
  'dist/favicon.ico',
  'dist/manifest.webmanifest',
  'dist/sw.js',
  'dist/icons/app-icon.svg',
  'dist/icons/pwa-192x192.png',
  'dist/icons/pwa-512x512.png',
  'dist/icons/pwa-maskable-512x512.png',
  'dist/icons/apple-touch-icon.png',
  'dist/third-party-licenses.txt',
  'dist/vendor/mathjax/MathJax.js',
];

await Promise.all(requiredFiles.map(file => access(file)));

const indexHtml = await readFile('dist/index.html', 'utf8');
const thirdPartyLicenses = await readFile('dist/third-party-licenses.txt', 'utf8');
const serviceWorker = await readFile('dist/sw.js', 'utf8');
const manifest = JSON.parse(await readFile('dist/manifest.webmanifest', 'utf8'));
const distFiles = await readdir('dist');
assert.match(
  indexHtml,
  /component-url="\/_astro\/parser\.[^"?]+\.js"/,
  'The generated index.html does not load the Preact parser component.',
);
assert.match(
  indexHtml,
  /renderer-url="\/_astro\/parser\.[^"?]+\.js"/,
  'The generated index.html does not load the Preact renderer.',
);
assert.match(
  indexHtml,
  /<astro-island[^>]+client="load"/,
  'The generated index.html does not hydrate the parser on page load.',
);
assert.match(
  indexHtml,
  /src="\/vendor\/mathjax\/MathJax\.js\?config=TeX-AMS_CHTML"/,
  'The generated index.html does not load the local MathJax runtime.',
);
assert.doesNotMatch(
  indexHtml,
  /(?:cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com)/,
  'The generated index.html still references a CDN.',
);
assert.equal(manifest.start_url, '/');
assert.equal(manifest.scope, '/');
assert.equal(manifest.display, 'standalone');
assert.match(manifest.theme_color, /^#[\da-f]{6}$/i);
assert.match(manifest.background_color, /^#[\da-f]{6}$/i);
assert.match(
  indexHtml,
  new RegExp(`<meta name="theme-color" content="${manifest.theme_color}"`),
  'The document and PWA manifest theme colors do not match.',
);
assert.ok(
  manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'),
  'The PWA manifest does not include a maskable 512x512 icon.',
);
assert.match(
  serviceWorker,
  /vendor\/mathjax/,
  'The service worker does not precache the MathJax resources.',
);
assert.match(
  serviceWorker,
  /vendor\/zxing-wasm\/zxing_reader\.wasm/,
  'The service worker does not precache the QR reader WASM.',
);
assert.doesNotMatch(
  serviceWorker,
  /Development-only service worker/,
  'The production build still contains the development passthrough service worker.',
);
assert.match(
  serviceWorker,
  /const PRECACHE_CONCURRENCY = 8;/,
  'The production service worker does not use the expected eight-worker pool.',
);
assert.match(
  serviceWorker,
  /classwiz-qr-precache-/,
  'The production service worker does not use versioned application caches.',
);
assert.match(
  serviceWorker,
  /await copyUnchanged\(/,
  'The production service worker does not reuse unchanged cached resources.',
);
assert.match(
  serviceWorker,
  /await caches\.delete\(CACHE_NAME\)/,
  'The production service worker does not roll back incomplete installations.',
);
assert.equal(
  distFiles.some(file => /^workbox-[\w.-]+\.js(?:\.map)?$/.test(file)),
  false,
  'The build contains an obsolete Workbox runtime.',
);
for (const packageName of [
  'decimal.js',
  'preact',
  'scratchblocks',
  'jsoneditor',
  'mathjax',
  'workbox-build',
]) {
  assert.match(
    thirdPartyLicenses,
    new RegExp(`^${packageName} `, 'm'),
    `The third-party license bundle is missing ${packageName}.`,
  );
}
assert.match(
  thirdPartyLicenses,
  /^NOTICE$/m,
  'The third-party license bundle is missing the JSONEditor NOTICE.',
);

console.log('Build output verification passed.');
