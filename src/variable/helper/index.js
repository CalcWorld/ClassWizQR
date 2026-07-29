import Decimal from 'decimal.js';
import { numberToFrac } from './num2frac.js';

/**
 *
 * @param {Decimal} a
 * @param {Decimal} b
 * @return {Decimal}
 */
const gcd = (a, b) => {
  while (!b.isZero()) {
    const temp = b;
    b = a.mod(b);
    a = temp;
  }
  return a.abs();
};
/**
 *
 * @param {Decimal} a
 * @param {Decimal} b
 * @return {Decimal}
 */
export const lcm = (a, b) => {
  if (a.isZero() || b.isZero()) return new Decimal(0);
  return a.mul(b).abs().div(gcd(a, b));
};
/**
 *
 * @param {string} numSign
 * @param {string|number|Decimal} d
 * @param {string|number|Decimal} c
 */
export const getImpFrac = (numSign, d, c) => `${numSign} \\dfrac {\\displaystyle ${d}} {\\displaystyle ${c}}`;
/**
 *
 * @param {string} numSign
 * @param {string|number|Decimal} a
 * @param {string|number|Decimal} b
 * @param {string|number|Decimal} c
 */
export const getMixedFrac = (numSign, a, b, c) => `${numSign} {\\displaystyle ${a}} \\dfrac {\\displaystyle ${b}} {\\displaystyle ${c}}`;
/**
 *
 * @param {Decimal} d
 * @param {Decimal} c
 * @return {Decimal[]}
 */
export const simpFrac = (d, c) => {
  const g = gcd(d, c);
  if (!g.eq(1)) {
    d = d.div(g);
    c = c.div(g);
  }
  return [d, c];
}
/**
 *
 * @param {string} displayCode
 * @param {string} fractionResult
 * @return {boolean}
 */
export const isMixedFrac = ({ displayCode, fractionResult }) => displayCode === 'C' || fractionResult === '1';
/**
 * @param {string} numSign
 * @param {Decimal} d
 * @param {Decimal} c
 * @param {string} displayCode
 * @param {string} fractionResult
 * @return {string}
 */
const autoGetFrac = ({ numSign, d, c, displayCode, fractionResult }) => {
  if (d.gt(c) && isMixedFrac({ displayCode, fractionResult })) {
    const quotient = d.divToInt(c);
    const remainder = d.mod(c);
    return getMixedFrac(numSign, quotient, remainder, c);
  } else {
    return getImpFrac(numSign, d, c);
  }
}
/**
 * @param {string|Decimal} num
 * @return {string}
 */
export const numberToLatex = (num) => {
  const decimalNum = new Decimal(num);
  const expSplit = decimalNum.toString().split('e');
  let latex;
  if (expSplit.length === 1) {
    latex = expSplit[0];
  } else {
    const int = expSplit[0];
    const exp = expSplit[1].replace('+', '');
    latex = `${int}\\times 10^{${exp}}`;
  }
  return latex;
}
/**
 *
 * @param displayCode
 * @param fractionResult
 * @param numSign
 * @param exp
 * @param valNum
 * @param num
 * @return {*}
 */
export const numberToFracLatex = ({ displayCode, fractionResult, numSign, valNum, num }) => {
  const type = {
    '16': 'CY', // EX
    '24': 'EY', // CW
  }[`${valNum.length}`];
  if (!type) return;

  const frac = numberToFrac(num, type);
  if (!frac) return;

  const [d, c] = frac;
  return autoGetFrac({ numSign, d, c, displayCode, fractionResult });
}
/**
 * @param {string|Decimal|number} num
 * @param {string|Decimal|number} pi_25200
 * @param {string|Decimal|number} digits
 */
export const numberToPiFrac = (num, pi_25200, digits) => {
  const r = new Decimal(num);
  const p = new Decimal(pi_25200);
  let d = r.div(p).toSignificantDigits(digits);
  if (!d.isInt()) {
    return;
  }
  let c;
  [d, c] = simpFrac(d, new Decimal(25200));
  return [d, c];
}
/**
 *
 * @param displayCode
 * @param fractionResult
 * @param numSign
 * @param valNum
 * @param num
 * @return {*}
 */
export const numberToPiFracLatex = ({ displayCode, fractionResult, numSign, valNum, num }) => {
  const [pi_25200, digits] = {
    '16': ['0.000124666375142452', 13], // EX
    '24': ['0.0001246663751424521126374', 19], // CW
  }[`${valNum.length}`] || [];
  if (!pi_25200) return;

  const frac = numberToPiFrac(num, pi_25200, digits);
  if (!frac) return;

  const [d, c] = frac;
  let template;
  if (d.eq(1) && c.eq(1)) {
    template = `${numSign}`;
  } else if (c.eq(1)) {
    template = `${numSign} ${d}`;
  } else {
    template = autoGetFrac({ numSign, d, c, displayCode, fractionResult });
  }
  return `${template} \\pi `;
}
