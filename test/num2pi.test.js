import Decimal from 'decimal.js';
import assert from 'assert';
import { test } from 'vitest';
import { numberToPiFrac } from '../src/variable/helper/index.js';

function cmp({ num, a, b, arithmeticDigits, digits, pi }) {
  const frac = numberToPiFrac(num, pi, arithmeticDigits, digits);
  assert.strictEqual(true, !!frac);
  const [d, c] = frac;
  assert.strictEqual(true, new Decimal(a).eq(d));
  assert.strictEqual(true, new Decimal(b).eq(c));
}

const cyPi = '3.1415926535898';
const cy_cmp = [
  ['0.0560998688141035', '1', '56'],
  ['3.1415926535898', '1', '1'],
  ['136273.923076923', '156158413', '3600'],
  ['538897.52173913', '720452917', '4200'],
  ['647958.389801477', '346502623', '1680'],
  ['37.6991118430776', '12', '1'],
  ['37.6991118430776', '12', '1'],
  ['124668.500205545', '71429789', '1800'],
  ['132350.995885195', '1061641487', '25200'],
];
const cy_digits = 13;

cy_cmp.forEach(([num, a, b]) => {
  test(`converts ClassWiz EX value ${num} to ${a}π/${b}`, () => {
    cmp({ num, a, b, arithmeticDigits: 15, digits: cy_digits, pi: cyPi });
  });
});

test('does not convert rejected ClassWiz EX boundary value to a π fraction', () => {
  assert.strictEqual(numberToPiFrac('124666.375267056', cyPi, 15, cy_digits), undefined);
  assert.strictEqual(numberToPiFrac('127205.833318032', cyPi, 15, cy_digits), undefined);
});


const eyPi = '3.1415926535897932384626';
const ey_cmp = [
  ['136273.92307695579588000', '156158413', '3600'],
  ['839794.95351609058402860', '748482101', '2800'],
  ['130821.45664852744423192', '349790809', '8400'],
];
const ey_digits = 19;

ey_cmp.forEach(([num, a, b]) => {
  test(`converts ClassWiz CW value ${num} to ${a}π/${b}`, () => {
    cmp({ num, a, b, arithmeticDigits: 23, digits: ey_digits, pi: eyPi });
  });
});

test('does not convert rejected ClassWiz CW boundary value to a π fraction', () => {
  assert.strictEqual(numberToPiFrac('130821.45677319381924971', eyPi, 23, ey_digits), undefined);
});
