const Decimal = require("decimal.js");

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

export const ParseAns = (ans) => {
  const ans1 = ans.slice(0, ans.length / 2);
  const ans2 = ans.slice(ans.length / 2);
  const [ans1Latex, ans1Decimal] = new ParseVariable(ans1).get();
  const [ans2Latex, ans2Decimal] = new ParseVariable(ans2).get();
  return [
    { name: 'AnsPart1', latex: ans1Latex, decimal: ans1Decimal },
    { name: 'AnsPart2', latex: ans2Latex, decimal: ans2Decimal }
  ];
  // if (ans2Decimal.eq(0)) {
  //   return { result: ans1Latex, ans1Latex, realDec: ans1Decimal };
  // } else if (ans2Decimal.gt(0)) {
  //   return { result: `${ans1Latex} +${ans2Latex}i`, ans1Latex, ans2Latex, ans1Decimal, ans2Decimal };
  // } else {
  //   return { result: `${ans1Latex} ${ans2Latex}i`, ans1Latex, ans2Latex, ans1Decimal, ans2Decimal };
  // }
}

export const ParseVariableList = (variable, modelType) => {
  const varIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'y'];
  modelType === 'CY' ? varIndex.push('M') : varIndex.push('z');
  const split = variable.match(/.{9}/g);
  const result = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(`0${split[i]}`).get();
    result.push({ name: varIndex[i], latex, decimal });
  }
  return result;
}

export const ParseTableRange = (parameter) => {
  const rangeIndex = ['Start', 'End', 'Step'];
  const split = parameter.match(/.{9}/g);
  const result = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(`0${split[i]}`).get();
    result.push({ name: rangeIndex[i], latex, decimal });
  }
  return result;
}

export const ParseMatrix = (matrix, m, n) => {
  const split = matrix.match(/.{20}/g);
  if (m * n !== split.length) {
    throw new Error('Matrix size not match');
  }

  const decimalResult = [];
  let latexResult = '\\begin{bmatrix}';
  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      const [latex, decimal] = new ParseVariable(split[i * n + j]).get();
      row.push(decimal);
      latexResult += `${latex} & `;
    }
    decimalResult.push(row);
    latexResult = latexResult.slice(0, -2);
    latexResult += '\\\\';
  }
  latexResult = latexResult.slice(0, -2);
  latexResult += '\\end{bmatrix}';
  return [latexResult, decimalResult];
}

export const ParseMatrixList = (matrix) => {
  const regx = /([MV])([A-DT])(\d)(\d)(\d+)/g;
  let match;
  const result = [];
  while ((match = regx.exec(matrix)) !== null) {
    const type = match[1] === 'M' ? 'Mat' : 'Vct';
    const name = match[2] === 'T' ? `${type}Ans` : `${type}${match[2]}`;
    const [latex, decimal] = ParseMatrix(match[5], match[3], match[4]);
    result.push({ name, latex, decimal });
  }
  return result;
}

export const ParseSpreadsheet = (spreadsheet) => {
  const position = spreadsheet.slice(2, 62).match(/[\dA-F]{12}/g).map(t => {
    return parseInt(t, 16).toString(2).padStart(48, '0').slice(0, 45);
  });
  const array = Array.from(Array(45), () => Array(5).fill(new Decimal(0)));
  let k = 0;
  for (let i = 0; i < position.length; i++) {
    for (let j = 0; j < position[i].length; j++) {
      const hasData = position[i][j] === '1';
      if (hasData) {
        const cell = spreadsheet.slice(62 + 9 * k, 62 + 9 * (k + 1));
        if (cell.match(/^[0-9]+$/)) {
          array[j][i] = new ParseVariable(`0${cell}`).get();
        } else {
          // TODO: parse ERROR
          array[j][i] = 'ERROR';
        }
        k++;
      }
    }
  }
  const csv = array.map(row => row.join(',')).join('\n');
  return { array, csv };
}

export const ParseStatistic = (stat) => {
  // TODO: parse column
  return stat.match(/.{6}/g).map(t => {
    const data = t.match(/.{2}/g).map(tt => {
      return parseInt(tt, 32).toString(10).padStart(3, '0')
    }).join('')
    const [latex, decimal] = new ParseVariable(`0${data}`).get();
    return decimal;
  });
}
