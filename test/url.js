import assert from 'node:assert/strict';
import test from 'node:test';

import { ClassWizQR } from '../src/index.js';

const payload = 'I-007A+U-000000000000+M-0E00000000+S-000410110000000E0010B000C5A9+E-F90539393900F901F90638383800F901F90736363600F901F903F901F902';
const expectedKv = {
  I: '007A',
  U: '000000000000',
  M: '0E00000000',
  S: '000410110000000E0010B000C5A9',
  E: 'F90539393900F901F90638383800F901F90736363600F901F903F901F902',
};

test('parses a ClassPad math redirect URL', () => {
  const result = new ClassWizQR()
    .setUrl(`https://classpad.net/note/#/tools/math?qr=${payload}`)
    .getResult();

  assert.deepEqual(result.kv, expectedKv);
  assert.equal(result.model.type, 'ClassWiz CW');
  assert.equal(result.model.id, '007');
});

test('parses a ClassPad URL with percent-encoded spaces', () => {
  const encodedPayload = payload.replaceAll('+', '%20');
  const result = new ClassWizQR()
    .setUrl(`https://classpad.net/note/#/tools/math?qr=${encodedPayload}`)
    .getResult();

  assert.deepEqual(result.kv, expectedKv);
});

test('detects a QR payload in the hash without relying on the hostname', () => {
  const result = new ClassWizQR()
    .setUrl(`https://example.com/tools/#/math?qr=${payload}`)
    .getResult();

  assert.deepEqual(result.kv, expectedKv);
  assert.equal(result.model.type, 'ClassWiz CW');
});

test('infers ClassPad model types from the numeric model ID', () => {
  const parseModelType = (id) => new ClassWizQR()
    .setUrl(`https://classpad.net/note/#/tools/math?qr=I-${id}A`)
    .getResult()
    .model.type;

  assert.equal(parseModelType('090'), 'ClassWiz CW');
  assert.equal(parseModelType('100'), 'ClassWiz EX');
  assert.equal(parseModelType('499'), 'ClassWiz EX');
  assert.equal(parseModelType('500'), 'ClassWiz CW 2nd edition');
  assert.equal(parseModelType('091'), 'ClassWiz CW 2nd edition');
});

test('continues to parse the original WES URL', () => {
  const result = new ClassWizQR()
    .setUrl(`http://wes.casio.com/ncal/index.php?q=${payload}`)
    .getResult();

  assert.deepEqual(result.kv, expectedKv);
  assert.equal(result.model.type, 'ClassWiz CW');
});
