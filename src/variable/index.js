import Decimal from "decimal.js";

export class ParseVariable {
  constructor(variable) {
    this.val = variable;
    this._parseProperty();
  }

  _parseProperty() {
    this.valType = this.val.slice(0, 1);
    this.valSign = this.val.slice(-3, -2);
    this.valExp = this.val.slice(-3);
    this.valNum = this.val.slice(1, -3);
  }

  _toDecimal() {
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

  _toFrac() {
    // TODO: negative number
    const fracArr = this.valNum.slice(0, this.valExp % 100).split('A');
    const a = fracArr[0];
    const b = fracArr[1];
    const c = fracArr[2] || '';
    let fracLatex, fracDec;
    if (fracArr.length === 2) {
      fracDec = new Decimal(a).div(b);
      fracLatex = `\\dfrac {${a}} {${b}}`;
    } else if (fracArr.length === 3) {
      fracDec = new Decimal(a).add(new Decimal(b).div(c));
      fracLatex = `{${a}} \\dfrac {${b}} {${c}}`;
    }
    return [fracLatex, fracDec];
  }

  _toDMS() {
    const [, decimal] = this._toDecimal();
    const d = decimal.floor();
    const mm = decimal.sub(d).times(60);
    const m = mm.floor();
    const s = mm.sub(m).times(60).toFixed(2);    // seems the accuracy is not enough
    const dms = `${d}^\\circ ${m}' ${s}'' `;
    return [dms, decimal];
  }

  _toSqrt() {
    // TODO: get common denominator
    const toOneSqrt = (sqrt) => {
      const r = new Decimal(sqrt.slice(0, 3));
      const a = new Decimal(sqrt.slice(3, 5));
      const b = new Decimal(sqrt.slice(5, 7));
      let latex, decimal;
      if (a.isZero() || r.isZero() || b.isZero()) {
        latex = '';
        decimal = new Decimal(0);
      } else if (r.eq(1)) {
        if (b.eq(1)) {
          latex = `${a} `;
          decimal = a;
        } else {
          latex = `\\frac {${a}} {${b}}`;
          decimal = a.div(b);
        }
      } else {
        if (b.eq(1)) {
          latex = `${a} \\sqrt{${r}} `;
          decimal = a.mul(r.sqrt());
        } else if (a.eq(1)) {
          latex = `\\frac {\\sqrt{${r}} } {${b}}`;
          decimal = a.mul(r.sqrt()).div(b);
        } else {
          latex = `\\frac {${a} \\sqrt{${r}} } {${b}}`;
          decimal = a.mul(r.sqrt()).div(b);
        }
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
    if (aSign && bSign) {
      latex = `${aLatex} + ${bLatex}`;
      decimal = aDecimal.add(bDecimal);
    } else if (aSign && !bSign) {
      latex = `${aLatex} - ${bLatex}`;
      decimal = aDecimal.sub(bDecimal);
    } else if (!aSign && bSign) {
      latex = `-${aLatex} + ${bLatex}`;
      decimal = bDecimal.sub(aDecimal);
    } else {
      latex = `-${aLatex} - ${bLatex}`;
      decimal = aDecimal.add(bDecimal).neg();
    }
    return [latex, decimal];
  }

  get() {
    switch (this.valType) {
      case '0':
        return this._toDecimal();
      case '2':
        return this._toFrac();
      case '4':
        return this._toDMS();
      case '8':
        return this._toSqrt();
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