export const translate = (dict) => {
  return dict[globalThis.cwqrConfig.language] || dict['en'];
}

export const availableLanguages = ['zh', 'en', 'vi'];
