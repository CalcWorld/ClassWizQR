import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

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
const appIcon = await readFile('dist/icons/app-icon.svg', 'utf8');
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
assert.equal(manifest.theme_color, '#356a96');
assert.equal(manifest.background_color, '#eef2f5');
assert.ok(
  manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'),
  'The PWA manifest does not include a maskable 512x512 icon.',
);
assert.match(
  serviceWorker,
  /vendor\/mathjax/,
  'The service worker does not precache the MathJax resources.',
);
assert.doesNotMatch(
  appIcon,
  /(?:linearGradient|radialGradient|filter|#fff(?:fff)?\b)/i,
  'The app icon must remain a flat-color design without a white foreground.',
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
