import scratchLanguages from 'virtual:scratchblocks-locales';

const localeModules = import.meta.glob(
  '../../../node_modules/scratchblocks/locales/*.json',
  { import: 'default' },
);

const localeLoaders = Object.fromEntries(
  Object.entries(localeModules).map(([path, load]) => {
    const filename = path.slice(path.lastIndexOf('/') + 1, -'.json'.length);
    return [filename, load];
  }),
);

let scratchblocksPromise;

export { scratchLanguages };
export const scratchLanguageCodes = scratchLanguages.map(({ code }) => code);

export function loadScratchblocks() {
  scratchblocksPromise ||= import('scratchblocks').then(module => module.default);
  return scratchblocksPromise;
}

export async function loadScratchLanguage(code) {
  if (code === 'en') return null;

  const load = localeLoaders[code];
  if (!load) throw new Error(`Unsupported Scratch Blocks language: ${code}`);
  return load();
}
