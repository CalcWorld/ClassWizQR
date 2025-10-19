import Decimal from "decimal.js";
import { tt } from "../utils.js";

function gcd(a, b) {
  while (!b.isZero()) {
    const temp = b;
    b = a.mod(b);
    a = temp;
  }
  return a.abs();
}

function lcm(a, b) {
  if (a.isZero() || b.isZero()) return new Decimal(0);
  return a.mul(b).abs().div(gcd(a, b));
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

  #toFrac(displayCode) {
    const numSign = this.valSign < 5 ? '' : '-';
    const signFix = this.valSign < 5 ? 1 : -1;
    const fracArr = this.valNum.slice(0, this.valExp % 100).split('A');
    const a = fracArr[0];
    const b = fracArr[1];
    const c = fracArr[2] || '';
    let fracLatex, fracDec;
    const getImpFrac = (d, c) => `${numSign} \\dfrac {\\displaystyle ${d}} {\\displaystyle ${c}}`;
    if (fracArr.length === 2) {
      fracDec = new Decimal(a).div(b).mul(signFix);
      fracLatex = getImpFrac(a, b);
    } else if (fracArr.length === 3) {
      fracDec = new Decimal(a).add(new Decimal(b).div(c)).mul(signFix);
      if (displayCode === 'C') {
        fracLatex = `${numSign} {\\displaystyle ${a}} \\dfrac {\\displaystyle ${b}} {\\displaystyle ${c}}`;
      } else {
        fracLatex = getImpFrac(a * c + +b, c);
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
    return [tt(`menu.${errCode}`), NaN];
  }

  get(displayCode) {
    switch (this.valType) {
      case '0':
        return this.#toDecimal();
      case '2':
        return this.#toFrac(displayCode);
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
