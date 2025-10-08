export const translate = (dict) => {
  if (typeof dict === 'string') return dict;
  return dict?.[globalThis.cwqrConfig?.language] || dict?.['en'];
}

export const availableLanguages = ['en', 'zh', 'vi', 'fr'];

export const loadResource = (language, resource) => {
  if (!globalThis.i18nResource) globalThis.i18nResource = {};
  globalThis.i18nResource[language] = resource;
};

export const getResource = (language) => {
  if (!availableLanguages.includes(language)) {
    console.error(`${language} is not available, fallback to en`);
    language = 'en';
  }
  if (globalThis.i18nResource?.[language]) return globalThis.i18nResource[language];
  else throw new Error(`${language} is not available, load it first`);
};

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
