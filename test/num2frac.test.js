import assert from 'assert';
import Decimal from 'decimal.js';
import { test } from 'vitest';
import { numberToFrac } from '../src/variable/helper/num2frac.js';

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

/**
 *
 * @param {Decimal} x
 * @param {string} type
 */
function testNumFail(x, type) {
  const frac = numberToFrac(x, type);
  assert.strictEqual(null, frac);
}

const cy_cmp = [
  ['0.666666666666663', '2', '3'],
  ['0.221789883268482', '57', '257'],
  ['0.0434782608695652', '1', '23'],
  ['0.043478260869565', '1', '23'],
  ['-0.0000001', '-1', '10000000'],
  ['0.0000001', '1', '10000000'],
  ['0.3', '3', '10'],
  ['18.2050147492625', '12343', '678'],
  ['0.550028356153285', '6789', '12343'],
  ['1.00001', '100001', '100000'],
];

cy_cmp.forEach(([x, a, b]) => {
  test(`converts EX value ${x} to ${a}/${b}`, () => {
    testNum2Frac(new Decimal(x), a, b, 'CY');
  });
});

const cy_fail = [
  ['0.00000001'],
  ['0'],
  ['1'],
  ['10'],
  ['1.81808808366475'], // 12343/6789
  ['1.000001'],
];

cy_fail.forEach(([x]) => {
  test(`fail to convert EX value ${x}`, () => {
    testNumFail(new Decimal(x), 'CY');
  });
});

const ey_cmp = [
  ['0.666666666666666663', '2', '3'],
  ['0.043478260869565217391304', '1', '23'],
  ['0.017543859649122807017543', '1', '57'],
  ['0.0000001', '1', '10000000'],
  ['0.021276595744680851', '1', '47'],
  ['0.3', '3', '10'],
  ['1.00001', '100001', '100000'],
];

ey_cmp.forEach(([x, a, b]) => {
  test(`converts CW value ${x} to ${a}/${b}`, () => {
    testNum2Frac(new Decimal(x), a, b, 'EY');
  });
});

const ey_fail = [
  ['0.00000001'],
  ['1.000001'],
];

ey_fail.forEach(([x]) => {
  test(`fail to convert CW value ${x}`, () => {
    testNumFail(new Decimal(x), 'EY');
  });
});
