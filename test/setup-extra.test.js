import assert from 'node:assert/strict';
import { test } from 'vitest';

import { parse } from './support/parser.js';

const validShortUrl = 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-X100000000+S-0CCE2';
const invalidShortUrl = 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-X100000000+S-0CCE3';
const fullSetupUrl = 'http://wes.casio.com/ncal/index.php?q=I-006A+U-000000000000+M-C10000AD00+S-000410110000000E0010B0002C6A+Q-09000000000000000007552801000000000000000000000000000000+E-7A7B7C79787739';

const findSetup = (url, type, language = 'en') => parse(url, language).setup
  .find(entry => entry.type === type);

test('URL checksum reports the calculated checksum as valid', () => {
  assert.deepEqual(findSetup(validShortUrl, 'URL_CHECKSUM'), {
    name: 'URL Checksum',
    value: 'CCE2 OK',
    type: 'URL_CHECKSUM',
    code: 'CCE2',
  });
});

test('URL checksum reports a mismatched checksum as invalid', () => {
  assert.deepEqual(findSetup(invalidShortUrl, 'URL_CHECKSUM'), {
    name: 'URL Checksum',
    value: 'CCE2 NG',
    type: 'URL_CHECKSUM',
    code: 'CCE3',
  });
});

const localizedSetupNames = {
  en: { preserve: 'Preserve', checksum: 'URL Checksum' },
  zh: { preserve: '保留项', checksum: 'URL校验和' },
  vi: { preserve: 'Giữ nguyên', checksum: 'Tổng kiểm tra URL' },
  fr: { preserve: 'Conserver', checksum: 'Somme de contrôle de l’URL' },
};

for (const [language, names] of Object.entries(localizedSetupNames)) {
  test(`new setup fields are localized in ${language}`, () => {
    assert.deepEqual(findSetup(fullSetupUrl, 'PRESERVE_SETTING', language), {
      name: names.preserve,
      value: '0',
      type: 'PRESERVE_SETTING',
      code: '0',
    });
    assert.deepEqual(findSetup(fullSetupUrl, 'URL_CHECKSUM', language), {
      name: names.checksum,
      value: '2C6A OK',
      type: 'URL_CHECKSUM',
      code: '2C6A',
    });
  });
}
