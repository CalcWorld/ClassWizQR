import assert from 'node:assert/strict';
import test from 'node:test';
import { matchSupportedLocale } from '../web/src/scripts/locales.js';

const regionalLanguages = ['en', 'zh-CN', 'zh-TW', 'fr-FR'];

test('matches exact locales case-insensitively', () => {
  assert.equal(matchSupportedLocale('ZH_cn', regionalLanguages), 'zh-CN');
});

test('prefers the locale for the inferred region', () => {
  assert.equal(matchSupportedLocale('zh', regionalLanguages), 'zh-CN');
  assert.equal(matchSupportedLocale('zh-TW', regionalLanguages), 'zh-TW');
  assert.equal(matchSupportedLocale('fr', regionalLanguages), 'fr-FR');
});

test('falls back when a language is unsupported or invalid', () => {
  assert.equal(matchSupportedLocale('vi', regionalLanguages), 'en');
  assert.equal(matchSupportedLocale('not_a_locale', regionalLanguages), 'en');
});
