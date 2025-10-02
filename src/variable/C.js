import { ParseVariable } from "./index.js";
import { inputInfo } from './input.js';
import { ParseMode } from "../mode/index.js";
import { translate } from "../utils.js";

const ParseMatrix = (matrix, m, n) => {
  const split = matrix.match(/.{20}/g);
  if (m * n !== split.length) {
    throw new Error('Matrix size not match');
  }

  const decimalResult = [];
  const element = [];
  let latexResult = '\\begin{bmatrix}';
  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      const [latex, decimal] = new ParseVariable(split[i * n + j]).get();
      row.push(latex);
      decimalResult.push(decimal);
      latexResult += `${latex} & `;
    }
    element.push(row);
    latexResult = latexResult.slice(0, -2);
    if (i !== m - 1) {
      latexResult += '\\\\';
    }
  }
  latexResult += '\\end{bmatrix}';
  return [latexResult, decimalResult, element];
}

export const ParseMatrixList = (C) => {
  const regx = /M([A-DT])(\d)(\d)([\dA]+)/g;
  let match;
  const result = [];
  while ((match = regx.exec(C)) !== null) {
    const name = match[1] === 'T' ? `MatAns` : `Mat${match[1]}`;
    let m = parseInt(match[2]);
    let n = parseInt(match[3]);
    const [latex, decimal, element] = ParseMatrix(match[4], m, n);
    result.push({ name, latex, decimal, element });
  }
  return result;
}

const ParseVector = (vector, n) => {
  const split = vector.match(/.{20}/g);
  if (n !== split.length) {
    throw new Error('Vector size not match');
  }

  const decimalResult = [];
  const element = [];
  let latexResult = '\\begin{bmatrix}';
  for (let i = 0; i < n; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get();
    decimalResult.push(decimal);
    element.push(latex);
    latexResult += `${latex}`;
    if (i !== n - 1) {
      latexResult += ' \\\\ ';
    }
  }
  latexResult += '\\end{bmatrix}';
  return [latexResult, decimalResult, [element]];
}

export const ParseVectorList = (C) => {
  const regx = /V([A-CT])(\d)(\d)([\dA]+)/g;
  let match;
  const result = [];
  while ((match = regx.exec(C)) !== null) {
    const name = match[1] === 'T' ? `VctAns` : `Vct${match[1]}`;
    const n = parseInt(match[3]);
    const [latex, decimal, element] = ParseVector(match[4], n);
    result.push({ name, latex, decimal, element });
  }
  return result;
}

export const ParseEquation = (M, C) => {
  const split = C.match(/.{20}/g);
  const parseM = new ParseMode(M);
  const mainMode = parseM.getMainMode();
  let subMode = parseM.getSubMode();
  let equType, omitPlus, m, n;
  switch (mainMode) {
    case '45':
      equType = 'EQUATION';
      break;
    case '4A':
      equType = 'RATIO';
      omitPlus = [0, 1, 2];
      m = 1;
      n = 3;
      break;
    case '4B':
      equType = 'INEQUALITY';
      omitPlus = [0];
      m = 1;
      n = subMode.slice(1, 2) - 1;
      subMode += parseM.getInqType();
      break;
  }
  omitPlus || (omitPlus = inputInfo[equType][subMode]['omitPlus']);
  (m || n) || ([m, n] = inputInfo[equType][subMode]['coefficient']);
  let template = inputInfo[equType][subMode].template;
  const decimalResult = [];
  const element = [];
  let elementRow = [];
  let i;
  for (i = 0; i < split.length; i++) {
    let [latex, decimal] = new ParseVariable(split[i]).get();
    elementRow.push(latex);
    decimalResult.push(decimal);
    if (!omitPlus.includes(i) && decimal.gte(0)) {
      latex = '+' + latex;
    }
    template = template.replace(`\$\{${i}\}`, latex);
    if ((i + 1) % n === 0) {
      element.push(elementRow);
      elementRow = [];
    }
  }
  if (i !== m * n || template.includes('$')) {
    throw new Error('Equation template not match');
  }
  return { latex: template, decimal: decimalResult, element };
}

export const ParseDistribution = (M, C) => {
  const subMode = new ParseMode(M).getSubMode();
  const split = C.match(/.{20}/g);
  const distInfo = inputInfo['DISTRIBUTION'][subMode][split.length];
  let template = distInfo.template;
  if (typeof template === 'object') {
    template = translate(template);
  }
  const decimalResult = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get();
    template = template.replace(`\$\{${i}\}`, latex);
    decimalResult.push(decimal);
  }
  return { latex: template, decimal: decimalResult };
}

/**
 * @typedef {import('decimal.js').default} Decimal
 */

/**
 * @param {string} M
 * @param {string} C
 * @return {{subMode: (string), quantity: (Decimal), attempts: (Decimal), freqResultType: (Decimal|null), freqResultTypeName: (string)}}
 * @constructor
 */
export const ParseMathBoxParameter = (M, C) => {
  const split = C.match(/.{20}/g);
  const parseM = new ParseMode(M);
  const subMode = parseM.getResultTemplate();
  let freqResultType, freqResultTypeName
  const quantity = (new ParseVariable(split[0]).get())[1];
  const attempts = (new ParseVariable(split[1]).get())[1];
  switch (subMode) {
    case 'S1':
      // Dice Roll
      freqResultType = (new ParseVariable(split[2]).get())[1];
      freqResultTypeName = freqResultType.eq(0) ? 'Sum' : 'Diff';
      break;
    case 'S2':
      // Coin Toss
      freqResultType = null;
      freqResultTypeName = 'Side';
      break;
    default:
      throw new Error('Unsupported MathBox');
  }

  return {
    subMode,
    quantity,
    attempts,
    freqResultType,
    freqResultTypeName,
  };
}
