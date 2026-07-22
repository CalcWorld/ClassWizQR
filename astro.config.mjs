import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
      viteStaticCopy({
        targets: [
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
