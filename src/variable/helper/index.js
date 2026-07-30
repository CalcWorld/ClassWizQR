import Decimal from 'decimal.js';
import { recDecToLatex } from '../../ascii/recdec.js';
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
export const decimalToLatex = (num) => {
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
 * @param {object} options
 * @param {Decimal} options.num
 * @param {string} [options.valNum]
 * @return {Decimal[]|null|undefined}
 */
export const decimalToFrac = ({ num, valNum }) => {
  const type = {
    '16': 'CY', // EX
    '24': 'EY', // CW
  }[`${valNum?.length}`];
  if (!type) return;

  return numberToFrac(num, type);
};

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
export const decimalToFracLatex = ({ displayCode, fractionResult, numSign, valNum, num }) => {
  const frac = decimalToFrac({ num, valNum });
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
export const decimalToPiFracLatex = ({ displayCode, fractionResult, numSign, valNum, num }) => {
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

export const decimalToDmsLatex = (decimal) => {
  let d = decimal.floor();
  const mm = decimal.sub(d).times(60);
  let m = mm.floor();
  let s = mm.sub(m).times(60).toDP(2);

  // Rounding can produce 60 seconds (or 60 minutes after carrying).
  if (s.gte(60)) {
    s = new Decimal(0);
    m = m.plus(1);
  }
  if (m.gte(60)) {
    m = new Decimal(0);
    d = d.plus(1);
  }

  return `${d}^\\circ ${m}' ${s}'' `;
};

/**
 * @param {Decimal} decimal
 * @return {string|undefined}
 */
export const decimalToPrimeFactorLatex = (decimal) => {
  if (
    !Decimal.isDecimal(decimal)
    || !decimal.isFinite()
    || !decimal.isInt()
    || decimal.lt(2)
    || decimal.gt('9999999999')
  ) return;

  let remaining = BigInt(decimal.toFixed(0));
  const factors = [];

  for (
    let divisor = 2n;
    divisor <= 997n && divisor * divisor <= remaining;
    divisor = divisor === 2n ? 3n : divisor + 2n
  ) {
    let exponent = 0;
    while (remaining % divisor === 0n) {
      remaining /= divisor;
      exponent += 1;
    }
    if (exponent > 0) {
      factors.push(exponent === 1 ? `${divisor}` : `${divisor}^{${exponent}}`);
    }
  }

  if (remaining > 1n) {
    factors.push(remaining >= 1018081n ? `(${remaining})` : `${remaining}`);
  }

  return factors.join(' \\times ');
};

/**
 * @param {object} options
 * @param {Decimal|string|number} options.numerator
 * @param {Decimal|string|number} options.denominator
 * @param {string} [options.modelType]
 * @param {string} [options.modelId]
 * @return {string|undefined}
 */
export const fracToRecDecLatex = ({ numerator, denominator, modelType, modelId }) => {
  const numeratorDecimal = new Decimal(numerator);
  const denominatorDecimal = new Decimal(denominator);
  if (
    !numeratorDecimal.isFinite()
    || !denominatorDecimal.isFinite()
    || !numeratorDecimal.isInt()
    || !denominatorDecimal.isInt()
    || denominatorDecimal.isZero()
  ) return;

  const negative = numeratorDecimal.isNegative() !== denominatorDecimal.isNegative();
  const numeratorBigInt = BigInt(numeratorDecimal.abs().toFixed(0));
  const denominatorBigInt = BigInt(denominatorDecimal.abs().toFixed(0));
  const integer = numeratorBigInt / denominatorBigInt;
  let remainder = numeratorBigInt % denominatorBigInt;
  const positions = new Map();
  const digits = [];

  while (remainder !== 0n && !positions.has(remainder)) {
    positions.set(remainder, digits.length);
    remainder *= 10n;
    digits.push((remainder / denominatorBigInt).toString());
    remainder %= denominatorBigInt;
  }

  // A terminating decimal has no recurring part.
  if (remainder === 0n) return;

  const recurringStart = positions.get(remainder);
  const nonRecurring = digits.slice(0, recurringStart).join(' ');
  const recurring = digits.slice(recurringStart).join(' ');
  const decimalMark = new Decimal("0.1").toString()[1];
  const sign = negative && numeratorBigInt !== 0n ? '-' : '';
  const prefix = nonRecurring ? `${nonRecurring} ` : '';

  return `${sign}${integer} ${decimalMark} ${prefix}${recDecToLatex(recurring, modelType, modelId)}`;
};

/**
 * @param {object} options
 * @param {string} options.numSign
 * @param {string} options.valNum
 * @param {Decimal} options.num
 * @param {string} [options.modelType]
 * @param {string} [options.modelId]
 * @return {string|undefined}
 */
export const decimalToRecDecLatex = ({ numSign, valNum, num, modelType, modelId }) => {
  if (!Decimal.isDecimal(num) || !num.isFinite()) return;

  const fraction = decimalToFrac({
    num: num.abs(),
    valNum,
  });
  if (!fraction) return;

  return fracToRecDecLatex({
    numerator: numSign === '-' || num.isNegative() ? fraction[0].neg() : fraction[0],
    denominator: fraction[1],
    modelType,
    modelId,
  });
};
