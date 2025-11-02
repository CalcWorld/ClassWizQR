import Decimal from 'decimal.js';
import { numberToPiFrac } from '../src/variable/index.js';
import assert from 'assert';

const cy_pi_25200 = '0.000124666375142452';
const cy_cmp = [
  ['0.0560998688141035', '1', '56'],
  ['3.1415926535898', '1', '1'],
  ['136273.923076923', '156158413', '3600'],
  ['538897.52173913', '720452917', '4200'],
  ['647958.389801477', '346502623', '1680'],
  ['37.6991118430776', '12', '1'],
  ['37.6991118430776', '12', '1'],
];
const cy_digits = 13;


cy_cmp.forEach(([result, a, b]) => {
  const parse = numberToPiFrac(result, cy_pi_25200, cy_digits);
  console.log(parse, result);
  const { converted, frac } = parse;
  assert.strictEqual(true, converted);
  const [d, c] = frac;
  assert.strictEqual(true, new Decimal(a).eq(d));
  assert.strictEqual(true, new Decimal(b).eq(c));
});
