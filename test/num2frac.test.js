import assert from 'assert';
import Decimal from 'decimal.js';
import { test } from 'vitest';
import { numberToFrac } from '../src/variable/num2frac.js';

/**
 *
 * @param {Decimal} x
 * @param {string} a
 * @param {string} b
 * @param {string} type
 */
function testNum2Frac(x, a, b, type) {
  const frac = numberToFrac(x, type);
  assert.strictEqual(true, Boolean(frac));
  assert.strictEqual(true, new Decimal(a).eq(frac[0]));
  assert.strictEqual(true, new Decimal(b).eq(frac[1]));
}

const cy_cmp = [
  ['0.666666666666663', 'CY', '2', '3'],
  ['0.221789883268482', 'CY', '57', '257'],
  ['0.0434782608695652', 'CY', '1', '23'],
  // ['0.142855714285714', 'CY', '99999', '700000'],
  // ['158730.142857142', '0.00000005', '1111111', '7'],
];

cy_cmp.forEach(([x, e, a, b]) => {
  test(`converts ClassWiz EX value ${x} to ${a}/${b}`, () => {
    testNum2Frac(new Decimal(x), a, b, e);
  });
});

const ey_cmp = [
  ['0.666666666666666663', 'EY', '2', '3'],
  ['0.043478260869565217391304', 'EY', '1', '23'],
  ['0.017543859649122807017543', 'EY', '1', '57'],
];

ey_cmp.forEach(([x, e, a, b]) => {
  test(`converts ClassWiz CW value ${x} to ${a}/${b}`, () => {
    testNum2Frac(new Decimal(x), a, b, e);
  });
});
