import { access } from 'node:fs/promises';
import { generateSW } from 'workbox-build';

await access('dist/index.html');

const { count, size, warnings } = await generateSW({
  globDirectory: 'dist',
  globPatterns: ['**/*'],
  globIgnores: [
    'sw.js',
    'workbox-*.js',
    '_headers',
    '_redirects',
  ],
  swDest: 'dist/sw.js',
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: false,
  mode: 'production',
  sourcemap: false,
});

if (warnings.length) {
  throw new Error(`Unable to generate a complete offline cache:\n${warnings.join('\n')}`);
}

console.log(
  `Generated dist/sw.js with ${count} precached files (${(size / 1024 / 1024).toFixed(2)} MiB).`,
);
