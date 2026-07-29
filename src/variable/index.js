import Decimal from "decimal.js";
import { tt } from "../utils.js";
import {
  decimalToDmsLatex,
  decimalToRecDecLatex,
  decimalToPrimeFactor,
  fracToRecDecLatex,
  getImpFrac,
  getMixedFrac,
  isMixedFrac,
  lcm,
  decimalToFracLatex,
  decimalToLatex,
  decimalToPiFracLatex
} from './helper/index.js';

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
    const numLatex = decimalToLatex(numDec);
    return [numLatex, numDec];
  }

  /**
   * @param {string} [displayCode]
   * @param {string} [fractionResult]
   * @param {string} [modelType]
   * @param {string} [modelId]
   */
  #toStandardByDecimal({ displayCode, fractionResult, modelType, modelId }) {
    const { valSign, valExp, valNum } = this;
    const exp = valExp < 500 ? valExp - 100 : valExp - 600;
    let numSign, int, dec;
    numSign = valSign < 5 ? '' : '-';
    int = valNum.slice(0, 1);
    dec = valNum.slice(1);
    const result = `${numSign}${int}.${dec}E${exp}`;
    const numDec = new Decimal(result);
    const num = numDec.abs();
    let numLatex;

    if (displayCode === '1') {
      // DMS result
      numLatex = decimalToDmsLatex(numDec);
    } else if (displayCode === 'E') {
      // Recurring Decimal
      numLatex = decimalToRecDecLatex({
        numSign,
        valNum,
        num,
        modelType,
        modelId,
      });
    } else if (displayCode === 'F' && numDec.isInt() && numDec.gte(2) && numDec.lte('9999999999')) {
      // Prime Factor
      numLatex = decimalToPrimeFactor(numDec);
    } else if (!numDec.isInt()) {
      numLatex = decimalToPiFracLatex({
        numSign,
        valNum,
        num,
        displayCode,
        fractionResult,
      }) || decimalToFracLatex({
        numSign,
        valNum,
        num,
        displayCode,
        fractionResult,
      });
    }
    if (!numLatex) {
      numLatex = decimalToLatex(numDec);
    }
    return [numLatex, numDec];
  }

  /**
   * @param {string} [displayCode]
   * @param {string} [fractionResult]
   * @param {string} [modelType]
   * @param {string} [modelId]
   */
  #toFrac({ displayCode, fractionResult, modelType, modelId }) {
    const numSign = this.valSign < 5 ? '' : '-';
    const signFix = this.valSign < 5 ? 1 : -1;
    const fracArr = this.valNum.slice(0, this.valExp % 100).split('A');
    const a = fracArr[0];
    const b = fracArr[1];
    const c = fracArr[2] || '';
    let fracLatex, fracDec, numerator, denominator;
    if (fracArr.length === 2) {
      numerator = new Decimal(a).mul(signFix);
      denominator = new Decimal(b);
      fracDec = numerator.div(denominator);
      fracLatex = getImpFrac(numSign, a, b);
    } else if (fracArr.length === 3) {
      numerator = new Decimal(a).mul(c).plus(b).mul(signFix);
      denominator = new Decimal(c);
      fracDec = numerator.div(denominator);
      if (isMixedFrac({ displayCode, fractionResult })) {
        fracLatex = getMixedFrac(numSign, a, b, c);
      } else {
        fracLatex = getImpFrac(numSign, a * c + +b, c);
      }
    }
    if (displayCode === 'E') {
      fracLatex = fracToRecDecLatex({
        numerator,
        denominator,
        modelType,
        modelId,
      }) || fracLatex;
    }
    return [fracLatex, fracDec];
  }

  #toDMS({ displayCode, fractionResult, modelType, modelId, }) {
    const [, decimal] = this.#toDecimal();
    if (displayCode === '1') {
      const dms = decimalToDmsLatex(decimal)
      return [dms, decimal];
    }
    return this.#toStandardByDecimal({
      displayCode,
      fractionResult,
      modelType,
      modelId,
    });
  }

  #toSqrt({ displayCode }) {
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
    if (displayCode === '1') {
      latex = decimalToDmsLatex(decimal);
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
   * @param {string} [options.modelType]
   * @param {string} [options.modelId]
   * @return {[string,Decimal]}
   */
  get(options = {}) {
    const { displayCode } = options;
    switch (this.valType) {
      case '0':
        // return this.#toDecimal();
        return this.#toStandardByDecimal(options);
      case '2':
        return this.#toFrac(options);
      case '4':
        return this.#toDMS(options);
      case '8':
        return this.#toSqrt({ displayCode });
      case 'F':
        return this.#toError();
    }
  }
}
