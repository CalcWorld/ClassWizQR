import assert from 'assert';
import Decimal from 'decimal.js';
import { test } from 'vitest';
import {
  decimalToDmsLatex,
  decimalToRecDecLatex,
  fracToRecDecLatex,
} from '../src/variable/helper/index.js';
import { ParseVariable } from '../src/variable/index.js';

test('carries rounded seconds into minutes', () => {
  assert.strictEqual(
    decimalToDmsLatex(new Decimal('0.833333333333333')),
    "0^\\circ 50' 0'' ", // not 0°49' 60''
  );
});

test('carries rounded minutes into degrees', () => {
  assert.strictEqual(
    decimalToDmsLatex(new Decimal('12.999999')),
    "13^\\circ 0' 0'' ",
  );
});

test('converts a decimal to dotted recurring notation', () => {
  assert.strictEqual(
    decimalToRecDecLatex({
      numSign: '',
      valNum: '142857142857142857142857',
      num: new Decimal('0.14285714285714285714'),
      modelType: 'EY',
      modelId: '031',
    }),
    '0 . \\dot{1}4285\\dot{7} ',
  );
});

test('converts a fraction to recurring notation', () => {
  assert.strictEqual(
    fracToRecDecLatex({
      numerator: 1,
      denominator: 6,
      modelType: 'EY',
      modelId: '008',
    }),
    '0 . 1 \\overline{6} ',
  );
});

test('converts a decimal to overline recurring notation', () => {
  assert.strictEqual(
    decimalToRecDecLatex({
      numSign: '',
      valNum: '116666666666666666666667',
      num: new Decimal('1.16666666666666666667'),
      modelType: 'EY',
      modelId: '008',
    }),
    '1 . 1 \\overline{6} ',
  );
});

test('converts a decimal to bracket recurring notation', () => {
  assert.strictEqual(
    decimalToRecDecLatex({
      numSign: '-',
      valNum: '142857142857142857142857',
      num: new Decimal('0.14285714285714285714'),
      modelType: 'EY',
      modelId: '023',
    }),
    '-0 . \\left( 1 4 2 8 5 7 \\right) ',
  );
});

test('uses recurring decimal notation for display code E', () => {
  assert.strictEqual(
    new ParseVariable('01428571428571429099').get({
      displayCode: 'E',
      modelType: 'CY',
      modelId: '001',
    })[0],
    '0 . \\dot{1}4285\\dot{7} ',
  );
});

test('uses recurring decimal notation for a fraction with display code E', () => {
  const fraction = `2${'1A7'.padEnd(24, '0')}103`;
  assert.strictEqual(
    new ParseVariable(fraction).get({
      displayCode: 'E',
      modelType: 'FY',
      modelId: '523',
    })[0],
    '0 . \\left( 1 4 2 8 5 7 \\right) ',
  );
});
