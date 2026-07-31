import { ClassWizQR } from '../../src/index.js';
import en from '../../src/i18n-res/en.json' with { type: 'json' };
import fr from '../../src/i18n-res/fr.json' with { type: 'json' };
import vi from '../../src/i18n-res/vi.json' with { type: 'json' };
import zh from '../../src/i18n-res/zh.json' with { type: 'json' };

const resources = { en, fr, vi, zh };

export const semanticFields = [
  'expression',
  'function',
  'graph',
  'equation',
  'tableRange',
  'result',
  'variable',
  'vector',
  'matrix',
  'spreadsheet',
  'statistic',
  'distribution',
  'mathBox',
  'algorithm',
  'sequence',
];

export function parse(url, language = 'en') {
  return new ClassWizQR()
    .setLanguage(language)
    .setI18nResource(resources)
    .setUrl(url)
    .getResult();
}

export function normalize(value) {
  return JSON.parse(JSON.stringify(value));
}

export function projectResult(result) {
  const projected = {
    model: result.model,
    mode: result.mode,
    format: result.format,
    setup: result.setup?.map(({ type, code }) => ({ type, code })),
    semanticFields: semanticFields.filter(field => result[field] !== undefined),
  };

  for (const field of semanticFields) {
    if (result[field] !== undefined) projected[field] = result[field];
  }

  return normalize(projected);
}

export function projectLocalization(result, fields = []) {
  const projected = {
    mode: result.mode,
    format: result.format,
    setup: result.setup,
  };

  for (const field of fields) {
    if (result[field] !== undefined) projected[field] = result[field];
  }

  return normalize(projected);
}
