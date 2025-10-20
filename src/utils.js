import enI18n from './i18n-res/en.json' with { type: 'json' };

export const availableLanguages = ['en', 'zh', 'vi', 'fr'];

export const loadResource = (language, resource) => {
  if (!globalThis.i18nResource) globalThis.i18nResource = {};
  globalThis.i18nResource[language] = resource;
};

export const getResource = (language) => {
  if (language === 'en') return enI18n;
  if (globalThis.i18nResource?.[language]) return globalThis.i18nResource[language];
  else throw new Error(`${language} is not available, load it first`);
};

/**
 * @param {string} key
 * @param {...string[]} [params]
 * @return {string}
 */
export const tt = (key, ...params) => {
  const language = globalThis.cwqrConfig?.language || 'en';
  let current = getResource(language);
  const keys = key.split('.');
  for (const key of keys) {
    current = current?.[key];
  }
  if (typeof current === 'undefined' && language !== 'en') {
    current = getResource('en');
    for (const key of keys) {
      current = current?.[key];
    }
  }
  for (const [i, param] of params.entries()) {
    current = current?.replace(`\$\{${i}\}`, param);
  }
  return current;
}

export const toAsciiArray = (text) => {
  return text.match(/F[\dA-F]{3}|[\dA-F]{2}/g);
};
