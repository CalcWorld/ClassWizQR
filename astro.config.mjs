import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const scratchblocksLocalesId = 'virtual:scratchblocks-locales';
const resolvedScratchblocksLocalesId = `\0${scratchblocksLocalesId}`;

function scratchblocksLocaleManifest() {
  const localeDirectory = fileURLToPath(
    new URL('./node_modules/scratchblocks/locales/', import.meta.url),
  );
  const languages = [
    { code: 'en', name: 'English' },
    ...readdirSync(localeDirectory)
      .filter(filename => filename.endsWith('.json'))
      .map(filename => {
        const code = filename.slice(0, -'.json'.length);
        const locale = JSON.parse(readFileSync(`${localeDirectory}/${filename}`, 'utf8'));
        return { code, name: locale.name || code };
      }),
  ].sort((left, right) => left.name.localeCompare(right.name));

  return {
    name: 'scratchblocks-locale-manifest',
    resolveId(id) {
      return id === scratchblocksLocalesId ? resolvedScratchblocksLocalesId : null;
    },
    load(id) {
      return id === resolvedScratchblocksLocalesId
        ? `export default ${JSON.stringify(languages)};`
        : null;
    },
  };
}

export default defineConfig({
  srcDir: './web/src',
  publicDir: './web/public',
  outDir: './dist',
  output: 'static',
  trailingSlash: 'never',
  integrations: [preact()],
  build: {
    format: 'file',
  },
  vite: {
    environments: {
      client: {
        build: {
          rolldownOptions: {
            output: {
              entryFileNames: '_astro/parser.[hash].js',
            },
          },
        },
      },
    },
    plugins: [
      scratchblocksLocaleManifest(),
      viteStaticCopy({
        targets: [
          {
            src: 'third-party-licenses.txt',
            dest: '.',
          },
          {
            src: 'src/i18n-res/*.json',
            dest: 'i18n-res',
          },
          {
            src: 'node_modules/mathjax/MathJax.js',
            dest: 'vendor/mathjax',
          },
          {
            src: 'node_modules/mathjax/config/TeX-AMS_CHTML.js',
            dest: 'vendor/mathjax/config',
          },
          {
            src: 'node_modules/mathjax/extensions',
            dest: 'vendor/mathjax',
          },
          {
            src: 'node_modules/mathjax/jax',
            dest: 'vendor/mathjax',
          },
          {
            src: 'node_modules/mathjax/localization',
            dest: 'vendor/mathjax',
          },
          {
            src: 'node_modules/mathjax/fonts/HTML-CSS/TeX/{eot,otf,woff}',
            dest: 'vendor/mathjax/fonts/HTML-CSS/TeX',
          },
        ],
      }),
    ],
  },
});
