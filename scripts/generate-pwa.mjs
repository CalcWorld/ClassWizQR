import { createHash } from 'node:crypto';
import {
  access,
  readFile,
  readdir,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { getManifest } from 'workbox-build';

await access('dist/index.html');

const oldWorkboxFiles = (await readdir('dist'))
  .filter(file => /^workbox-[\w.-]+\.js(?:\.map)?$/.test(file));
await Promise.all(oldWorkboxFiles.map(file => unlink(`dist/${file}`)));

const {
  count,
  manifestEntries,
  size,
  warnings,
} = await getManifest({
  globDirectory: 'dist',
  globPatterns: ['**/*'],
  globIgnores: [
    'sw.js',
    'workbox-*.js',
    '_headers',
    '_redirects',
  ],
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
});

if (warnings.length) {
  throw new Error(`Unable to generate a complete offline cache:\n${warnings.join('\n')}`);
}

const serializedManifest = JSON.stringify(manifestEntries);
const template = await readFile('scripts/service-worker.js', 'utf8');
const cacheVersion = createHash('sha256')
  .update(template)
  .update(serializedManifest)
  .digest('hex')
  .slice(0, 20);
const serviceWorker = template
  .replace('__PRECACHE_MANIFEST__', serializedManifest)
  .replace('__CACHE_VERSION__', cacheVersion);

await writeFile('dist/sw.js', serviceWorker);

console.log(
  `Generated dist/sw.js with ${count} precached files `
  + `(${(size / 1024 / 1024).toFixed(2)} MiB) and 8 concurrent workers.`,
);
