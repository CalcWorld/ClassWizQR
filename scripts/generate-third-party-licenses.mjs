import { readFile, writeFile } from 'node:fs/promises';

const components = [
  {
    packageName: 'decimal.js',
    files: ['LICENCE.md'],
  },
  {
    packageName: 'preact',
    files: ['LICENSE'],
  },
  {
    packageName: 'scratchblocks',
    files: ['LICENSE'],
    note:
      'The scratchblocks project notes that its icons are derived from Scratch Blocks, ' +
      'which is licensed under the Apache License 2.0. The Apache License 2.0 text is ' +
      'included below with the Apache-licensed components.',
  },
  {
    packageName: 'jsoneditor',
    files: ['LICENSE', 'NOTICE'],
  },
  {
    packageName: 'mathjax',
    files: ['LICENSE'],
  },
];

const separator = `${'='.repeat(80)}\n`;
const sections = [];

for (const component of components) {
  const packageDirectory = new URL(`../node_modules/${component.packageName}/`, import.meta.url);
  const metadata = JSON.parse(
    await readFile(new URL('package.json', packageDirectory), 'utf8'),
  );
  const contents = [
    separator,
    `${metadata.name} ${metadata.version}\n`,
    `License: ${metadata.license}\n`,
  ];

  if (component.note) {
    contents.push(`\n${component.note}\n`);
  }

  for (const filename of component.files) {
    const licenseText = (await readFile(new URL(filename, packageDirectory), 'utf8')).trim();
    contents.push(`\n${filename.toUpperCase()}\n${'-'.repeat(filename.length)}\n${licenseText}\n`);
  }

  sections.push(contents.join(''));
}

const output = [
  'THIRD-PARTY LICENSES\n',
  '\n',
  'This file contains license and attribution notices for third-party software\n',
  'distributed with ClassWiz QR. It is generated from the installed packages by\n',
  'scripts/generate-third-party-licenses.mjs; do not edit it manually.\n\n',
  ...sections,
].join('');

await writeFile(new URL('../third-party-licenses.txt', import.meta.url), output, 'utf8');
console.log('Generated third-party-licenses.txt.');
