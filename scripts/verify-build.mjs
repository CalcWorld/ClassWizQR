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
  'dist/third-party-licenses.txt',
  'dist/vendor/mathjax/MathJax.js',
];

await Promise.all(requiredFiles.map(file => access(file)));

const indexHtml = await readFile('dist/index.html', 'utf8');
const thirdPartyLicenses = await readFile('dist/third-party-licenses.txt', 'utf8');
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
for (const packageName of ['decimal.js', 'preact', 'scratchblocks', 'jsoneditor', 'mathjax']) {
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
