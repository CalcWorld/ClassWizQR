export const translate = (dict) => {
  if (typeof dict === 'string') return dict;
  return dict[globalThis.cwqrConfig.language] || dict['en'];
}

export const availableLanguages = ['zh', 'en', 'vi'];
