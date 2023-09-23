import { ParseVariable } from "./index.js";
import equationInfo from './equation.json' assert { type: "json" };

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
  // TODO: 解耦vector，降为一维数组
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

export const ParseEquation = (M, C) => {
  const split = C.match(/.{20}/g);
  const mainMode = M.slice(0, 2);
  let subMode = M.slice(2, 4);
  if (subMode === '4B') {
    subMode += M.slice(6, 8);
  }
  let equType;
  switch (mainMode) {
    case '45':
      equType = 'EQUATION';
      break;
    case '4A':
      equType = 'RATIO';
      break;
    case '4B':
      equType = 'INEQUALITY';
      break;
  }
  let latexExpression = equationInfo[equType][subMode].template;
  const omitPlus = equationInfo[equType][subMode].omitPlus;
  const decimalResult = [];
  for (let i = 0; i < split.length; i++) {
    let [latex, decimal] = new ParseVariable(split[i]).get();
    if (!omitPlus.includes(i) && decimal.gte(0)) {
      latex  = '+' + latex;
    }
    latexExpression = latexExpression.replace(`\$\{${i}\}`, latex);
    decimalResult.push(decimal);
  }
  console.assert(latexExpression.indexOf('$') === -1);
  return { latex: latexExpression, decimal: decimalResult };
}
