import Decimal from "decimal.js";
import { tt } from "../utils.js";

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
const lcm = (a, b) => {
  if (a.isZero() || b.isZero()) return new Decimal(0);
  return a.mul(b).abs().div(gcd(a, b));
};

/**
 *
 * @param {string} numSign
 * @param {string|number|Decimal} d
 * @param {string|number|Decimal} c
 */
const getImpFrac = (numSign, d, c) => `${numSign} \\dfrac {\\displaystyle ${d}} {\\displaystyle ${c}}`;

/**
 *
 * @param {string} numSign
 * @param {string|number|Decimal} a
 * @param {string|number|Decimal} b
 * @param {string|number|Decimal} c
 */
const getMixedFrac = (numSign, a, b, c) => `${numSign} {\\displaystyle ${a}} \\dfrac {\\displaystyle ${b}} {\\displaystyle ${c}}`;

/**
 * @param {string|Decimal} num
 * @return {string}
 */
const numberToLatex = (num) => {
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
 * https://stackoverflow.com/a/5128558
 * @param {string|Decimal} num
 * @param {string|Decimal} error
 */
export const numberToFrac = (num, error) => {
  const x = new Decimal(num);
  const e = new Decimal(error);

  let lowerN = new Decimal(0);
  let lowerD = new Decimal(1);

  let upperN = new Decimal(1);
  let upperD = new Decimal(1);

  while (true) {
    const middleN = lowerN.plus(upperN);
    const middleD = lowerD.plus(upperD);

    if (middleN.toString().length + middleD.toString().length > 12) {
      return { converted: false };
    }

    if (middleD.times(x.plus(e)).lt(middleN)) {
      upperN = middleN;
      upperD = middleD;
    } else if (middleN.lt(middleD.times(x.minus(e)))) {
      lowerN = middleN;
      lowerD = middleD;
    } else {
      return { converted: true, frac: [middleN, middleD] };
    }
  }
}

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
const isMixedFrac = ({ displayCode, fractionResult }) => displayCode === 'C' || fractionResult === '1';

/**
 *
 * @param displayCode
 * @param fractionResult
 * @param numSign
 * @param exp
 * @param valNum
 * @return {*}
 */
const numberToFracLatex = ({ displayCode, fractionResult, numSign, exp, valNum }) => {
  const error = {
    '16': '0.00000000000005', // EX
    '24': '0.000000000000000005', // CW
  }[`${valNum.length}`];
  if (!error) return;

  const { converted, frac } = numberToFrac(`0.${valNum}`, error);
  if (!converted) return;

  let [d, c] = frac;
  d = d.times(Decimal.pow(10, +exp + 1));
  [d, c] = simpFrac(d, c);
  if (d.gt(c) && isMixedFrac({ displayCode, fractionResult })) {
    const quotient = d.divToInt(c);
    const remainder = d.mod(c);
    return getMixedFrac(numSign, quotient, remainder, c);
  } else {
    return getImpFrac(numSign, d, c);
  }
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
    return { converted: false };
  }
  let c;
  [d, c] = simpFrac(d, new Decimal(25200));
  return { converted: true, frac: [d, c] };
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
const numberToPiFracLatex = ({ displayCode, fractionResult, numSign, valNum, num }) => {
  const [pi_25200, digits] = {
    '16': ['0.000124666375142452', 13], // EX
    '24': ['0.0001246663751424521126374', 19], // CW
  }[`${valNum.length}`] || [];
  if (!pi_25200) return;

  const { converted, frac } = numberToPiFrac(num, pi_25200, digits);
  if (!converted) return;

  const [d, c] = frac;
  let template;
  if (d.eq(1) && c.eq(1)) {
    template = `${numSign}`;
  } else if (c.eq(1)) {
    template = `${numSign} ${d}`;
  } else if (d.gt(c) && isMixedFrac({ displayCode, fractionResult })) {
    const quotient = d.divToInt(c);
    const remainder = d.mod(c);
    template = getMixedFrac(numSign, quotient, remainder, c);
  } else {
    template = getImpFrac(numSign, d, c);
  }
  return `${template} \\pi `;
}

export class ParseVariable {
  constructor(variable) {
    this.val = variable;
    this.#parseProperty();
  }

  #parseProperty() {
    this.valType = this.val.slice(0, 1);
    this.valSign = this.val.slice(-3, -2);
    this.valExp = this.val.slice(-3);
    this.valNum = this.val.slice(1, -3);
  }

  #toDecimal() {
    const exp = this.valExp < 500 ? this.valExp - 100 : this.valExp - 600;
    let numSign, int, dec;
    numSign = this.valSign < 5 ? '' : '-';
    int = this.valNum.slice(0, 1);
    dec = this.valNum.slice(1);
    const result = `${numSign}${int}.${dec}E${exp}`;
    const numDec = new Decimal(result);
    const numLatex = numberToLatex(numDec);
    return [numLatex, numDec];
  }

  /**
   * @param {string} [displayCode]
   * @param {string} [fractionResult]
   */
  #toStandardByDecimal(displayCode, fractionResult) {
    const { valSign, valExp, valNum } = this;
    const exp = valExp < 500 ? valExp - 100 : valExp - 600;
    let numSign, int, dec;
    numSign = valSign < 5 ? '' : '-';
    int = valNum.slice(0, 1);
    dec = valNum.slice(1);
    const result = `${numSign}${int}.${dec}E${exp}`;
    const numDec = new Decimal(result);
    let numLatex;

    if (!numDec.isInt()) {
      if (numDec.lt(1000000)) {
        numLatex = numberToPiFracLatex({
          numSign,
          valNum,
          num: numDec.abs(),
          displayCode,
          fractionResult,
        });
      }
      if (!numLatex) {
        numLatex = numberToFracLatex({
          numSign,
          valNum,
          exp,
          displayCode,
          fractionResult,
        });
      }
    }

    // fallback
    if (!numLatex) {
      numLatex = numberToLatex(numDec);
    }
    return [numLatex, numDec];
  }

  /**
   * @param {string} [displayCode]
   * @param {string} [fractionResult]
   */
  #toFrac(displayCode, fractionResult) {
    const numSign = this.valSign < 5 ? '' : '-';
    const signFix = this.valSign < 5 ? 1 : -1;
    const fracArr = this.valNum.slice(0, this.valExp % 100).split('A');
    const a = fracArr[0];
    const b = fracArr[1];
    const c = fracArr[2] || '';
    let fracLatex, fracDec;
    if (fracArr.length === 2) {
      fracDec = new Decimal(a).div(b).mul(signFix);
      fracLatex = getImpFrac(numSign, a, b);
    } else if (fracArr.length === 3) {
      fracDec = new Decimal(a).add(new Decimal(b).div(c)).mul(signFix);
      if (isMixedFrac({ displayCode, fractionResult })) {
        fracLatex = getMixedFrac(numSign, a, b, c);
      } else {
        fracLatex = getImpFrac(numSign, a * c + +b, c);
      }
    }
    return [fracLatex, fracDec];
  }

  #toDMS() {
    const [, decimal] = this.#toDecimal();
    const d = decimal.floor();
    const mm = decimal.sub(d).times(60);
    const m = mm.floor();
    const s = mm.sub(m).times(60).toFixed(2);    // seems the accuracy is not enough
    const dms = `${d}^\\circ ${m}' ${s}'' `;
    return [dms, decimal];
  }

  #toSqrt() {
    const toOneSqrt = (sqrt) => {
      // sqrt(r) * (a/b)
      const r = new Decimal(sqrt.slice(0, 3)); // root
      const a = new Decimal(sqrt.slice(3, 5)); // numerator
      const b = new Decimal(sqrt.slice(5, 7)); // denominator
      let latex, decimal;
      if (a.isZero() || r.isZero() || b.isZero()) {
        latex = '0';
        decimal = new Decimal(0);
      } else if (r.eq(1)) {
        if (b.eq(1)) {
          latex = `${a} `;
        } else {
          latex = `\\dfrac {\\displaystyle ${a}} {\\displaystyle ${b}}`;
        }
        decimal = a.div(b);
      } else {
        const aLatex = a.eq(1) ? '' : a;
        if (b.eq(1)) {
          latex = `${aLatex} \\sqrt{${r}} `;
        } else {
          latex = `\\dfrac {\\displaystyle ${aLatex} \\sqrt{${r}} } {\\displaystyle ${b}}`;
        }
        decimal = a.mul(r.sqrt()).div(b);
      }
      return [latex, decimal, { r, a, b }];
    }

    const a = this.valNum.slice(0, 7);
    const b = this.valNum.slice(8, 15);
    let aSign = this.valExp.slice(-3, -2) === '1';
    let bSign = this.valExp.slice(-1) !== '6';
    const [aLatex, aDecimal, aRoot] = toOneSqrt(a);
    const [bLatex, bDecimal, bRoot] = toOneSqrt(b);
    let latex, originLatex, decimal;
    if (!aDecimal.isZero() && !bDecimal.isZero()) {
      if (aSign && bSign) {
        originLatex = `${aLatex}+${bLatex}`;
        decimal = aDecimal.add(bDecimal);
      } else if (aSign && !bSign) {
        originLatex = `${aLatex}-${bLatex}`;
        decimal = aDecimal.sub(bDecimal);
      } else if (!aSign && bSign) {
        originLatex = `-${aLatex}+${bLatex}`;
        decimal = bDecimal.sub(aDecimal);
      } else {
        originLatex = `-${aLatex}-${bLatex}`;
        decimal = aDecimal.add(bDecimal).neg();
      }

      const commonDenominator = lcm(aRoot.b, bRoot.b);
      if (commonDenominator.eq(1)) {
        latex = originLatex;
      } else {
        let allSign = '';
        if (!aSign && !bSign) {
          allSign = '-';
          aSign = bSign = true;
        }
        const aCoe = commonDenominator.div(aRoot.b).mul(aRoot.a);
        const bCoe = commonDenominator.div(bRoot.b).mul(bRoot.a);
        latex = `${aSign ? '' : '-'} ${aCoe.eq(1) ? '' : aCoe} ${aRoot.r.eq(1) ? '' : `\\sqrt{${aRoot.r}}`} ${aCoe.eq(1) && aRoot.r.eq(1) ? '1' : ''}`
          + `${bSign ? '+' : '-'} ${bCoe.eq(1) ? '' : bCoe} ${bRoot.r.eq(1) ? '' : `\\sqrt{${bRoot.r}}`} ${bCoe.eq(1) && bRoot.r.eq(1) ? '1' : ''}`;
        latex = `${allSign} \\dfrac { \\displaystyle ${latex} } {\\displaystyle ${commonDenominator}}`;
        // latex += `\\ \\left( ${originLatex} \\right)`
      }
    } else {
      decimal = !aDecimal.isZero() ? aDecimal : bDecimal;
      latex = !aDecimal.isZero() ? aLatex : bLatex;
      const sign = !aDecimal.isZero() ? aSign : bSign;
      latex = sign ? latex : `-${latex}`;
      decimal = sign ? decimal : decimal.neg();
    }
    return [latex, decimal];
  }

  #toError() {
    const errCode = `Y${this.val.slice(1, 2)}`;
    return [tt(`menu.${errCode}`), new Decimal(NaN)];
  }

  /**
   * @param {object} [options]
   * @param {string} [options.displayCode]
   * @param {string} [options.fractionResult]
   * @return {[string,Decimal]}
   */
  get(options) {
    const { displayCode, fractionResult } = options || {};
    switch (this.valType) {
      case '0':
        // return this.#toDecimal();
        return this.#toStandardByDecimal(displayCode, fractionResult);
      case '2':
        return this.#toFrac(displayCode, fractionResult);
      case '4':
        return this.#toDMS();
      case '8':
        return this.#toSqrt();
      case 'F':
        return this.#toError();
    }
  }
}
