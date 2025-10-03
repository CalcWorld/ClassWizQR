export const translate = (dict) => {
  if (typeof dict === 'string') return dict;
  return dict[globalThis.cwqrConfig.language] || dict['en'];
}

export const availableLanguages = ['zh', 'en', 'vi'];

export const toAsciiArray = (text) => {
  return text.match(/F[\dA-F]{3}|[\dA-F]{2}/g);
};
