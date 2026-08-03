import assert from 'node:assert/strict';
import { test } from 'vitest';

import { getModelProfile } from '../src/model/index.js';
import { parse } from './support/parser.js';

const japaneseUrl = 'http://wes.casio.com/math/index.php?q=I-243F+U-000000000000+M-Z000000000+S-10061';
const englishUrl = 'http://wes.casio.com/math/index.php?q=I-243F+U-000000000000+M-X100000000+S-0C506';
const germanUrl = 'http://wes.casio.com/math/index.php?q=I-250A+U-000000000000+M-Z000000000+S-00000';

const cases = [
  {
    name: 'EX menu page in Japanese',
    url: japaneseUrl,
    code: '1',
    setupCount: 1,
  },
  {
    name: 'EX manual page in English',
    url: englishUrl,
    code: '0',
    setupCount: 1,
  },
  {
    name: 'CW full setup in Japanese',
    url: 'http://wes.casio.com/ncal/index.php?q=I-031A+U-000000000000+M-C10000AD00+S-001410100000000E1110B0007EB0+Q-00000000000000000000000000000000000000000000000000000000+E-4A',
    code: '1',
    setupCount: 21,
  },
  {
    name: 'CW menu page in English',
    url: 'http://wes.casio.com/ncal/index.php?q=I-031A+U-000000000000+M-Z000000000+S-04B42',
    code: '0',
    setupCount: 1,
  },
  {
    name: 'CW error page in English',
    url: 'http://wes.casio.com/ncal/index.php?q=I-031A+U-000000000000+M-Y200000000+S-0AD71',
    code: '0',
    setupCount: 1,
  },
  {
    name: 'CW error page in Japanese',
    url: 'http://wes.casio.com/ncal/index.php?q=I-031A+U-000000000000+M-Y200000000+S-12C91',
    code: '1',
    setupCount: 1,
  },
  {
    name: 'CW calculation with full setup in Japanese',
    url: 'http://wes.casio.com/ncal/index.php?q=I-031A+U-000000000000+M-C10000DD00+S-001410100000000E1110B000AA3A+Q-80000001000202010000000000010000000000000000000000000000+E-741A381B',
    code: '1',
    setupCount: 21,
  },
];

for (const { name, url, code, setupCount } of cases) {
  test(name, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, setupCount);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: code === '0' ? 'English' : '日本語 (Japanese)',
      type: 'LANGUAGE',
      code,
    }]);
  });
}

const localizedLanguages = {
  en: {
    name: 'Language',
    english: 'English',
    japanese: '日本語 (Japanese)',
  },
  zh: {
    name: '语言',
    english: 'English (英语)',
    japanese: '日本語 (日语)',
  },
  vi: {
    name: 'Ngôn ngữ',
    english: 'English (Tiếng Anh)',
    japanese: '日本語 (tiếng Nhật)',
  },
  fr: {
    name: 'Langue',
    english: 'English (Anglais)',
    japanese: '日本語 (japonais)',
  },
};

for (const [locale, expected] of Object.entries(localizedLanguages)) {
  test(`Japanese calculator languages are localized in ${locale}`, () => {
    const getLanguage = url => parse(url, locale).setup
      .find(({ type }) => type === 'LANGUAGE');

    assert.deepEqual(getLanguage(englishUrl), {
      name: expected.name,
      value: expected.english,
      type: 'LANGUAGE',
      code: '0',
    });
    assert.deepEqual(getLanguage(japaneseUrl), {
      name: expected.name,
      value: expected.japanese,
      type: 'LANGUAGE',
      code: '1',
    });
  });
}

const localizedGerman = {
  en: { name: 'Language', value: 'Deutsch (German)' },
  zh: { name: '语言', value: 'Deutsch (德语)' },
  vi: { name: 'Ngôn ngữ', value: 'Deutsch (tiếng Đức)' },
  fr: { name: 'Langue', value: 'Deutsch (allemand)' },
};

for (const [locale, expected] of Object.entries(localizedGerman)) {
  test(`German-only calculator language is localized in ${locale}`, () => {
    const language = parse(germanUrl, locale).setup
      .find(({ type }) => type === 'LANGUAGE');

    assert.deepEqual(language, {
      ...expected,
      type: 'LANGUAGE',
      code: '0',
    });
  });
}

test('German models expose their language table through the model profile', () => {
  assert.equal(getModelProfile('CY', '250').language, 'de');
  assert.equal(getModelProfile('CY', '216').language, 'de');
  assert.equal(getModelProfile('EY', '012').language, 'de');
  assert.equal(getModelProfile('EY', '047').language, 'de');
});

test('Japanese models expose their language table through the model profile', () => {
  assert.deepEqual(getModelProfile('CY', '243'), {
    locale: 'jp',
    language: 'jp',
  });
  assert.deepEqual(getModelProfile('EY', '031'), {
    locale: 'jp',
    language: 'jp',
  });
  assert.deepEqual(getModelProfile('FY', '529'), {
    locale: 'jp',
    language: 'jp',
  });
  assert.deepEqual(getModelProfile('CY', '230'), {});
});
