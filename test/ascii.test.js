import assert from 'node:assert/strict';
import { test } from 'vitest';

import { ascii00 } from '../src/ascii/00.js';
import { asciiFD } from '../src/ascii/FD.js';
import { AsciiTable } from '../src/ascii/index.js';
import { recDecToLatex } from '../src/ascii/recdec.js';
import { getModelProfile } from '../src/model/index.js';

const PAGE_PREFIXES = ['', 'FA', 'FB', 'FD', 'FE'];

test('ASCII entries use strings or [latex, unicode] pairs', () => {
  assert.equal(ascii00['30'], '0');
  assert.deepEqual(ascii00['22'], ['\\pi', 'π']);
  assert.deepEqual(ascii00['41'], ['\\mathrm{Ans}', 'Ans']);
  assert.deepEqual(ascii00['58'], ['\\mathrm{Min}(', 'Min(']);
  assert.deepEqual(asciiFD['01'], ['\\Sigma \\mathrm{x}^2', 'Σx²']);
});

test('model profiles contain only non-default capabilities', () => {
  assert.deepEqual(getModelProfile('CY', '230'), {});
  assert.deepEqual(getModelProfile('EY', '006'), {
    locale: 'fr',
    decimalMark: 'comma',
  });
  assert.deepEqual(getModelProfile('EY', '012'), {
    decimalMark: 'comma',
    recurringDecimal: 'overline',
  });
  assert.deepEqual(getModelProfile('FY', '523'), {
    recurringDecimal: 'bracket',
  });
});

test('AsciiTable keeps every registered page complete', () => {
  const table = new AsciiTable('CY', '230').get();

  assert.equal(Object.keys(table).length, PAGE_PREFIXES.length * 256);
  for (const prefix of PAGE_PREFIXES) {
    for (let code = 0; code < 256; code++) {
      const key = `${prefix}${code.toString(16).toUpperCase().padStart(2, '0')}`;
      assert.equal(Object.hasOwn(table, key), true, `missing ${key}`);
      assert.equal(typeof table[key], 'string', key);
    }
  }
  assert.equal(table['00'], '');
  assert.equal(table['FAFF'], '');
});

test('AsciiTable applies family, locale, notation, and regional variants', () => {
  const ey = new AsciiTable('EY', '001').get();
  assert.equal(ey['40'], '\\mathrm{Ans}');
  assert.equal(ey['FB11'], '\\to \\mathrm{A}');

  const frEy = new AsciiTable('EY', '006').get();
  assert.equal(frEy['2C'], ';');
  assert.equal(frEy['2E'], ',');
  assert.equal(frEy['40'], '\\mathrm{Rép}');
  assert.equal(frEy['41'], '\\mathrm{A}');

  const frEyUnicode = new AsciiTable('EY', '006').get('unicode');
  assert.equal(frEyUnicode['40'], 'Rép');

  const jp = new AsciiTable('CY', '240').get();
  assert.equal(jp['FE3D'], '\\mathrm{ft²▸cm²}');

  const fy = new AsciiTable('FY', '505').get();
  assert.equal(fy['FE27'], '\\mathrm{cal₁₅▸J}');
});

test('AsciiTable keeps explicit Unicode overrides', () => {
  const unicode = new AsciiTable('EY', '001').get('unicode');

  assert.equal(unicode['22'], 'π');
  assert.equal(unicode['41'], 'A');
  assert.equal(unicode['72'], 'e^(');
  assert.equal(unicode['73'], '10^(');
  assert.equal(unicode['FD01'], 'Σx²');
  assert.equal(unicode['FE21'], 'kgf·m▸J');
  assert.equal(unicode['FE25'], '°C▸°F');
});

test('recurring decimals support dots, overline, and brackets', () => {
  assert.equal(recDecToLatex('123', 'CY', '230'), '\\dot{1}2\\dot{3} ');
  assert.equal(recDecToLatex('123', 'EY', '012'), '\\overline{123} ');
  assert.equal(recDecToLatex('123', 'FY', '523'), '\\left( 123 \\right) ');
});
