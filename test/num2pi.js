import Decimal from 'decimal.js';
import { numberToPiFrac } from '../src/variable/index.js';
import assert from 'assert';

function cmp({ num, a, b, digits, pi_25200 }) {
  const parse = numberToPiFrac(num, pi_25200, digits);
  console.log(parse, num);
  const { converted, frac } = parse;
  assert.strictEqual(true, converted);
  const [d, c] = frac;
  assert.strictEqual(true, new Decimal(a).eq(d));
  assert.strictEqual(true, new Decimal(b).eq(c));
}

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

cy_cmp.forEach(([num, a, b]) => {
  cmp({ num, a, b, digits: cy_digits, pi_25200: cy_pi_25200 });
});


const ey_pi_25200 = '0.0001246663751424521126374';
const ey_cmp = [
  ['136273.92307695579588000', '156158413', '3600'],
];
const ey_digits = 19;

ey_cmp.forEach(([num, a, b]) => {
  cmp({ num, a, b, digits: ey_digits, pi_25200: ey_pi_25200 });
});
