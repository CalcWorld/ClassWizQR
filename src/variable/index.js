import Decimal from "decimal.js";
import { tt } from "../utils.js";

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

  #toFrac() {
    const numSign = this.valSign < 5 ? '' : '-';
    const signFix = this.valSign < 5 ? 1 : -1;
    const fracArr = this.valNum.slice(0, this.valExp % 100).split('A');
    const a = fracArr[0];
    const b = fracArr[1];
    const c = fracArr[2] || '';
    let fracLatex, fracDec;
    if (fracArr.length === 2) {
      fracDec = new Decimal(a).div(b).mul(signFix);
      fracLatex = `${numSign} \\dfrac {\\displaystyle ${a}} {\\displaystyle ${b}}`;
    } else if (fracArr.length === 3) {
      fracDec = new Decimal(a).add(new Decimal(b).div(c)).mul(signFix);
      fracLatex = `${numSign} {\\displaystyle ${a}} \\dfrac {\\displaystyle ${b}} {\\displaystyle ${c}}`;
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
    // TODO: get common denominator
    const toOneSqrt = (sqrt) => {
      const r = new Decimal(sqrt.slice(0, 3));
      const a = new Decimal(sqrt.slice(3, 5));
      const b = new Decimal(sqrt.slice(5, 7));
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
      return [latex, decimal];
    }

    const a = this.valNum.slice(0, 7);
    const b = this.valNum.slice(8, 15);
    const aSign = this.valExp.slice(-3, -2) === '1';
    const bSign = this.valExp.slice(-1) !== '6';
    const [aLatex, aDecimal] = toOneSqrt(a);
    const [bLatex, bDecimal] = toOneSqrt(b);
    let latex, decimal;
    if (!aDecimal.isZero() && !bDecimal.isZero()) {
      if (aSign && bSign) {
        latex = `${aLatex}+${bLatex}`;
        decimal = aDecimal.add(bDecimal);
      } else if (aSign && !bSign) {
        latex = `${aLatex}-${bLatex}`;
        decimal = aDecimal.sub(bDecimal);
      } else if (!aSign && bSign) {
        latex = `-${aLatex}+${bLatex}`;
        decimal = bDecimal.sub(aDecimal);
      } else {
        latex = `-${aLatex}-${bLatex}`;
        decimal = aDecimal.add(bDecimal).neg();
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
    return [tt(`menu.${errCode}`), NaN];
  }

  get() {
    switch (this.valType) {
      case '0':
        return this.#toDecimal();
      case '2':
        return this.#toFrac();
      case '4':
        return this.#toDMS();
      case '8':
        return this.#toSqrt();
      case 'F':
        return this.#toError();
    }
  }
}

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
