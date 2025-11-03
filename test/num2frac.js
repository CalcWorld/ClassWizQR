import { numberToFrac } from '../src/variable/index.js';
import assert from 'assert';
import Decimal from 'decimal.js';

/**
 *
 * @param {string} x
 * @param {string} a
 * @param {string} b
 * @param {string} error
 */
function testNum2Frac(x, a, b, error) {
  const result = numberToFrac(x, error);
  console.log(x, a, b, result);
  const { converted, frac } = result;
  assert.strictEqual(true, converted);
  assert.strictEqual(true, new Decimal(a).eq(frac[0]));
  assert.strictEqual(true, new Decimal(b).eq(frac[1]));
}

const cy_cmp = [
  ['0.666666666666663', '0.00000000000005', '2', '3'],
  ['0.221789883268482', '0.00000000000005', '57', '257'],
  ['0.0434782608695652', '0.00000000000005', '1', '23'],
  ['0.142855714285714', '0.00000000000005', '99999', '700000'],
  ['158730.142857142', '0.00000005', '1111111', '7'],
];
// const ex_error = '0.00000000000005';
cy_cmp.forEach(([x, e, a, b]) => {
  testNum2Frac(x, a, b, e);
});

const ey_cmp = [
  ['0.666666666666666663', '0.000000000000000005', '2', '3'],
  ['0.043478260869565217391304', '0.000000000000000005', '1', '23'],
  ['0.017543859649122807017543', '0.000000000000000005', '1', '57'],
];
// const ey_error = '0.000000000000000005';
ey_cmp.forEach(([x, e, a, b]) => {
  testNum2Frac(x, a, b, e);
});
