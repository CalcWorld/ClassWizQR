import assert from 'node:assert/strict';
import { test } from 'vitest';

import { getModelProfile } from '../src/model/index.js';
import { parse } from './support/parser.js';

const japaneseUrl = 'http://wes.casio.com/math/index.php?q=I-243F+U-000000000000+M-Z000000000+S-10061';
const englishUrl = 'http://wes.casio.com/math/index.php?q=I-243F+U-000000000000+M-X100000000+S-0C506';
const germanUrl = 'http://wes.casio.com/math/index.php?q=I-250A+U-000000000000+M-Z000000000+S-00000';
const frenchUrl = 'http://wes.casio.com/ncal/index.php?q=I-006A+U-000000000000+M-C10000AD00+S-000410110000000E0010B0002C6A+Q-09000000000000000007552801000000000000000000000000000000+E-7A7B7C79787739';
const belgianUrls = [
  'http://wes.casio.com/math/index.php?q=I-247A+U-000000000000+M-Z109000000+S-06B7A',
  'http://wes.casio.com/math/index.php?q=I-247A+U-000000000000+M-X100000000+S-1F1A1',
  'http://wes.casio.com/math/index.php?q=I-247A+U-000000000000+M-Y200000000+S-27F02',
];
const arabicUrls = [
  'http://wes.casio.com/math/index.php?q=I-258A+U-000000000000+M-Z10D000000+S-0AC7B',
  'http://wes.casio.com/math/index.php?q=I-258A+U-000000000000+M-X100000000+S-137AC',
];
const latinAmericanUrls = [
  'http://wes.casio.com/math/index.php?q=I-272F+U-000000000000+M-Z10C000000+S-076EF',
  'http://wes.casio.com/math/index.php?q=I-272F+U-000000000000+M-X100000000+S-12AB1',
  'http://wes.casio.com/math/index.php?q=I-272F+U-000000000000+M-C10000DD00+S-000410100000100E1210B0006DCE+R-8000000100220201000100000000000000000000+E-741A38381B',
];
const spanishUrls = [
  'http://wes.casio.com/math/index.php?q=I-254A+U-000000000000+M-X100000000+S-084CA',
  'http://wes.casio.com/math/index.php?q=I-254A+U-000000000000+M-C10000DD00+S-401410101000100E1110B00047A5+R-8000000100110301000100000000000000000000+E-741A39391B',
  'http://wes.casio.com/math/index.php?q=I-254A+U-000000000000+M-X900000000+S-26A5D',
];
const spanish2Urls = [
  'http://wes.casio.com/math/index.php?q=I-268F+U-000000000000+M-Z10F000000+S-0723D',
  'http://wes.casio.com/math/index.php?q=I-268F+U-000000000000+M-C10000DD00+S-401410101000100E1110B0003A8A+R-8000000100110301000100000000000000000000+E-741A39391B',
  'http://wes.casio.com/math/index.php?q=I-268F+U-000000000000+M-X100000000+S-290F5',
  'http://wes.casio.com/math/index.php?q=I-268F+U-000000000000+M-Y200000000+S-35FBA',
];
const spanish3Urls = [
  'http://wes.casio.com/ncal/index.php?q=I-011A+U-000000000000+M-Z000000000+S-0653F',
  'http://wes.casio.com/ncal/index.php?q=I-011A+U-000000000000+M-Z000000000+S-1E41F',
  'http://wes.casio.com/ncal/index.php?q=I-011A+U-000000000000+M-Z000000000+S-26780',
  'http://wes.casio.com/ncal/index.php?q=I-011A+U-000000000000+M-Z000000000+S-3E660',
  'http://wes.casio.com/ncal/index.php?q=I-011A+U-000000000000+M-Z000000000+S-460BD',
];
const centralEuropeanUrls = [
  'http://wes.casio.com/math/index.php?q=I-294F+U-000000000000+M-Z10C000000+S-0F65F',
  'http://wes.casio.com/math/index.php?q=I-294F+U-000000000000+M-X100000000+S-1959B',
  'http://wes.casio.com/math/index.php?q=I-294F+U-000000000000+M-Y200000000+S-2269B',
  'http://wes.casio.com/math/index.php?q=I-294F+U-000000000000+M-C10000AD00+S-000410100000100E1310B0000F86+R-0158384440324535009900000000000000000000+E-7939',
];
const vietnameseUrls = [
  'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-Z000000000+S-01BC4',
  'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-Z000000000+S-19CA4',
];
const serbianUrls = [
  'http://wes.casio.com/math/index.php?q=I-217A+U-000000000000+M-Z10C000000+S-0393A',
  'http://wes.casio.com/math/index.php?q=I-217A+U-000000000000+M-X100000000+S-1C88E',
];
const dutchUrls = [
  'http://wes.casio.com/ncal/index.php?q=I-521A+U-000000000000+M-Z000000000+S-08BBD',
  'http://wes.casio.com/ncal/index.php?q=I-521A+U-000000000000+M-Z000000000+S-10A9D',
];
const fallbackEnglishUrl = 'http://wes.casio.com/ncal/index.php?q=I-546A+U-000000000000+M-Z000000000+S-018E9';

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

const localizedFrench = {
  en: { name: 'Language', value: 'Français (French)' },
  zh: { name: '语言', value: 'Français (法语)' },
  vi: { name: 'Ngôn ngữ', value: 'Français (tiếng Pháp)' },
  fr: { name: 'Langue', value: 'Français' },
};

for (const [locale, expected] of Object.entries(localizedFrench)) {
  test(`French-only calculator language is localized in ${locale}`, () => {
    const language = parse(frenchUrl, locale).setup
      .find(({ type }) => type === 'LANGUAGE');

    assert.deepEqual(language, {
      ...expected,
      type: 'LANGUAGE',
      code: '0',
    });
  });
}

test('French models expose their language table through the model profile', () => {
  for (const [modelType, modelIds] of Object.entries({
    CY: ['246', '295'],
    EY: ['006', '090'],
    FY: ['091', '506'],
  })) {
    for (const modelId of modelIds) {
      assert.equal(getModelProfile(modelType, modelId).language, 'fr');
    }
  }
});

const localizedBelgianLanguages = {
  en: ['English', 'Français (French)', 'Nederlands (Dutch)'],
  zh: ['English (英语)', 'Français (法语)', 'Nederlands (荷兰语)'],
  vi: ['English (Tiếng Anh)', 'Français (tiếng Pháp)', 'Nederlands (tiếng Hà Lan)'],
  fr: ['English (Anglais)', 'Français', 'Nederlands (néerlandais)'],
};

for (const [code, url] of belgianUrls.entries()) {
  test(`Belgian sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedBelgianLanguages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedBelgianLanguages)) {
  test(`Belgian calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(belgianUrls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Belgian models expose their language table through the model profile', () => {
  assert.deepEqual(getModelProfile('CY', '247'), {
    decimalMark: 'comma',
    quotient: 'Q=',
    language: 'be',
  });
  assert.deepEqual(getModelProfile('EY', '007'), {
    decimalMark: 'comma',
    quotient: 'Q=',
    language: 'be',
  });
});

const localizedArabicLanguages = {
  en: ['English', 'عربي (Arabic)'],
  zh: ['English (英语)', 'عربي (阿拉伯语)'],
  vi: ['English (Tiếng Anh)', 'عربي (tiếng Ả Rập)'],
  fr: ['English (Anglais)', 'عربي (arabe)'],
};

for (const [code, url] of arabicUrls.entries()) {
  test(`Arabic sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedArabicLanguages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedArabicLanguages)) {
  test(`Arabic calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(arabicUrls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Arabic models expose their language table through the model profile', () => {
  for (const modelId of ['256', '257', '258', '259']) {
    assert.equal(getModelProfile('CY', modelId).language, 'ar');
  }
});

const localizedLatinAmericanLanguages = {
  en: ['English', 'Español (Spanish)', 'Português (Portuguese)'],
  zh: ['English (英语)', 'Español (西班牙语)', 'Português (葡萄牙语)'],
  vi: ['English (Tiếng Anh)', 'Español (tiếng Tây Ban Nha)', 'Português (tiếng Bồ Đào Nha)'],
  fr: ['English (Anglais)', 'Español (espagnol)', 'Português (portugais)'],
};

for (const [code, url] of latinAmericanUrls.entries()) {
  test(`Latin American sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, code === 2 ? 21 : 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedLatinAmericanLanguages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedLatinAmericanLanguages)) {
  test(`Latin American calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(latinAmericanUrls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Latin American models expose their language table through the model profile', () => {
  for (const [modelType, modelIds] of Object.entries({
    CY: ['270', '271', '272', '273'],
    EY: ['036', '038', '039'],
  })) {
    for (const modelId of modelIds) {
      assert.equal(getModelProfile(modelType, modelId).language, 'la');
    }
  }
});

const localizedSpanishLanguages = {
  en: ['Castellano (Spanish)', 'Català (Catalan)', 'Português (Portuguese)'],
  zh: ['Castellano (西班牙语)', 'Català (加泰罗尼亚语)', 'Português (葡萄牙语)'],
  vi: ['Castellano (tiếng Tây Ban Nha)', 'Català (tiếng Catalan)', 'Português (tiếng Bồ Đào Nha)'],
  fr: ['Castellano (espagnol)', 'Català (catalan)', 'Português (portugais)'],
};

for (const [code, url] of spanishUrls.entries()) {
  test(`Spanish sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, code === 1 ? 21 : 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedSpanishLanguages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedSpanishLanguages)) {
  test(`Spanish calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(spanishUrls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Spanish models expose their language table through the model profile', () => {
  for (const modelId of ['252', '253', '254', '255']) {
    assert.equal(getModelProfile('CY', modelId).language, 'sp');
  }
});

const localizedSpanish2Languages = {
  en: ['Castellano (Spanish)', 'Català (Catalan)', 'Euskara (Basque)', 'Português (Portuguese)'],
  zh: ['Castellano (西班牙语)', 'Català (加泰罗尼亚语)', 'Euskara (巴斯克语)', 'Português (葡萄牙语)'],
  vi: ['Castellano (tiếng Tây Ban Nha)', 'Català (tiếng Catalan)', 'Euskara (tiếng Basque)', 'Português (tiếng Bồ Đào Nha)'],
  fr: ['Castellano (espagnol)', 'Català (catalan)', 'Euskara (basque)', 'Português (portugais)'],
};

for (const [code, url] of spanish2Urls.entries()) {
  test(`Spanish 2 sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, code === 1 ? 21 : 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedSpanish2Languages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedSpanish2Languages)) {
  test(`Spanish 2 calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(spanish2Urls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Spanish 2 models expose their language table through the model profile', () => {
  for (const modelId of ['266', '267', '268', '269', '296']) {
    assert.equal(getModelProfile('CY', modelId).language, 'sp2');
  }
});

const localizedSpanish3Languages = {
  en: ['Castellano (Spanish)', 'Català (Catalan)', 'Euskara (Basque)', 'Galego (Galician)', 'Português (Portuguese)'],
  zh: ['Castellano (西班牙语)', 'Català (加泰罗尼亚语)', 'Euskara (巴斯克语)', 'Galego (加利西亚语)', 'Português (葡萄牙语)'],
  vi: ['Castellano (tiếng Tây Ban Nha)', 'Català (tiếng Catalan)', 'Euskara (tiếng Basque)', 'Galego (tiếng Galicia)', 'Português (tiếng Bồ Đào Nha)'],
  fr: ['Castellano (espagnol)', 'Català (catalan)', 'Euskara (basque)', 'Galego (galicien)', 'Português (portugais)'],
};

for (const [code, url] of spanish3Urls.entries()) {
  test(`Spanish 3 sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedSpanish3Languages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedSpanish3Languages)) {
  test(`Spanish 3 calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(spanish3Urls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Spanish 3 models expose their language table through the model profile', () => {
  for (const modelId of ['008', '009', '010', '011']) {
    assert.equal(getModelProfile('EY', modelId).language, 'sp3');
  }
});

const localizedCentralEuropeanLanguages = {
  en: ['Česky (Czech)', 'Magyar (Hungarian)', 'Polski (Polish)', 'Slovensky (Slovak)'],
  zh: ['Česky (捷克语)', 'Magyar (匈牙利语)', 'Polski (波兰语)', 'Slovensky (斯洛伐克语)'],
  vi: ['Česky (tiếng Séc)', 'Magyar (tiếng Hungary)', 'Polski (tiếng Ba Lan)', 'Slovensky (tiếng Slovakia)'],
  fr: ['Česky (tchèque)', 'Magyar (hongrois)', 'Polski (polonais)', 'Slovensky (slovaque)'],
};

for (const [code, url] of centralEuropeanUrls.entries()) {
  test(`Central European sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, code === 3 ? 21 : 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedCentralEuropeanLanguages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedCentralEuropeanLanguages)) {
  test(`Central European calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(centralEuropeanUrls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Central European models expose their language table through the model profile', () => {
  for (const modelId of ['291', '292', '293', '294']) {
    assert.equal(getModelProfile('CY', modelId).language, 'ce');
  }
});

const localizedVietnameseLanguages = {
  en: ['English', 'Tiếng Việt (Vietnamese)'],
  zh: ['English (英语)', 'Tiếng Việt (越南语)'],
  vi: ['English (Tiếng Anh)', 'Tiếng Việt'],
  fr: ['English (Anglais)', 'Tiếng Việt (vietnamien)'],
};

for (const [code, url] of vietnameseUrls.entries()) {
  test(`Vietnamese sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedVietnameseLanguages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedVietnameseLanguages)) {
  test(`Vietnamese calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(vietnameseUrls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Vietnamese models expose their language table through the model profile', () => {
  for (const [modelType, modelId] of [['CY', '298'], ['EY', '023'], ['FY', '523']]) {
    assert.deepEqual(getModelProfile(modelType, modelId), {
      recurringDecimal: 'bracket',
      language: 'vn',
    });
  }
});

const localizedSerbianLanguages = {
  en: ['Српски/Ћирилица (Serbian/Cyrillic)', 'Srpski/Latinica (Serbian/Latin)'],
  zh: ['Српски/Ћирилица (塞尔维亚语/西里尔字母)', 'Srpski/Latinica (塞尔维亚语/拉丁字母)'],
  vi: ['Српски/Ћирилица (tiếng Serbia/chữ Kirin)', 'Srpski/Latinica (tiếng Serbia/chữ Latinh)'],
  fr: ['Српски/Ћирилица (serbe/cyrillique)', 'Srpski/Latinica (serbe/latin)'],
};

for (const [code, url] of serbianUrls.entries()) {
  test(`Serbian sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedSerbianLanguages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedSerbianLanguages)) {
  test(`Serbian calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(serbianUrls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Serbian model exposes its language table through the model profile', () => {
  assert.deepEqual(getModelProfile('CY', '217'), {
    locale: 'rs',
    decimalMark: 'comma',
    language: 'rs',
  });
});

const localizedDutchLanguages = {
  en: ['English', 'Nederlands (Dutch)'],
  zh: ['English (英语)', 'Nederlands (荷兰语)'],
  vi: ['English (Tiếng Anh)', 'Nederlands (tiếng Hà Lan)'],
  fr: ['English (Anglais)', 'Nederlands (néerlandais)'],
};

for (const [code, url] of dutchUrls.entries()) {
  test(`Dutch sample uses language code ${code}`, () => {
    const { setup } = parse(url);
    const languageEntries = setup.filter(({ type }) => type === 'LANGUAGE');

    assert.equal(setup.length, 1);
    assert.deepEqual(languageEntries, [{
      name: 'Language',
      value: localizedDutchLanguages.en[code],
      type: 'LANGUAGE',
      code: String(code),
    }]);
  });
}

for (const [locale, expectedValues] of Object.entries(localizedDutchLanguages)) {
  test(`Dutch calculator languages are localized in ${locale}`, () => {
    const languages = expectedValues.map((value, code) => parse(dutchUrls[code], locale).setup
      .find(({ type }) => type === 'LANGUAGE'));

    assert.deepEqual(languages, expectedValues.map((value, code) => ({
      name: localizedLanguages[locale].name,
      value,
      type: 'LANGUAGE',
      code: String(code),
    })));
  });
}

test('Dutch models expose their language table through the model profile', () => {
  for (const [modelType, modelId] of [['EY', '021'], ['FY', '521']]) {
    assert.deepEqual(getModelProfile(modelType, modelId), {
      decimalMark: 'comma',
      language: 'nl',
    });
  }
});

for (const [locale, expected] of Object.entries(localizedLanguages)) {
  test(`models without a language profile fall back to English in ${locale}`, () => {
    const { setup } = parse(fallbackEnglishUrl, locale);

    assert.equal(getModelProfile('FY', '546').language, undefined);
    assert.equal(setup.length, 1);
    assert.deepEqual(setup.filter(({ type }) => type === 'LANGUAGE'), [{
      name: expected.name,
      value: expected.english,
      type: 'LANGUAGE',
      code: '0',
    }]);
  });
}

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
