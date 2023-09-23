import { ParseVariable } from "./index.js";
import equationInfo from './equation.json' assert { type: "json" };

const ParseMatrix = (matrix, m, n) => {
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
    if (i !== m - 1) {
      latexResult += '\\\\';
    }
  }
  latexResult += '\\end{bmatrix}';
  return [latexResult, decimalResult];
}

export const ParseMatrixList = (matrix) => {
  const regx = /M([A-DT])(\d)(\d)(\d+)/g;
  let match;
  const result = [];
  while ((match = regx.exec(matrix)) !== null) {
    const name = match[1] === 'T' ? `MatAns` : `Mat${match[1]}`;
    let m = parseInt(match[2]);
    let n = parseInt(match[3]);
    const [latex, decimal] = ParseMatrix(match[4], m, n);
    result.push({ name, latex, decimal });
  }
  return result;
}

const ParseVector = (vector, n) => {
  const split = vector.match(/.{20}/g);
  if (n !== split.length) {
    throw new Error('Vector size not match');
  }

  const decimalResult = [];
  let latexResult = '\\begin{bmatrix}';
  for (let i = 0; i < n; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get();
    decimalResult.push(decimal);
    latexResult += `${latex}`;
    if (i !== n - 1) {
      latexResult += ' \\\\ ';
    }
  }
  latexResult += '\\end{bmatrix}';
  return [latexResult, decimalResult];
}

export const ParseVectorList = (vector) => {
  const regx = /V([A-CT])(\d)(\d)(\d+)/g;
  let match;
  const result = [];
  while ((match = regx.exec(vector)) !== null) {
    const name = match[1] === 'T' ? `VctAns` : `Vct${match[1]}`;
    const n = parseInt(match[3]);
    const [latex, decimal] = ParseVector(match[4], n);
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
      latex = '+' + latex;
    }
    latexExpression = latexExpression.replace(`\$\{${i}\}`, latex);
    decimalResult.push(decimal);
  }
  if (latexExpression.includes('$')) {
    throw new Error('Equation template not match');
  }
  return { latex: latexExpression, decimal: decimalResult };
}
