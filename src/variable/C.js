import { ParseVariable } from "./index.js";
import { INPUT_INFO, INPUT_INFO_COEFFICIENT } from './input.js';
import { ParseMode } from "../mode/index.js";
import { ParseSetup } from '../setup/index.js';

/**
 * @param {string} matrix
 * @param {number} m
 * @param {number} n
 * @param {string} [fractionResult]
 */
const ParseMatrix = (matrix, m, n, fractionResult) => {
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
      const [latex, decimal] = new ParseVariable(split[i * n + j]).get({ fractionResult });
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
/**
 * @param {string} C
 * @param {string} S
 * @return {*[]}
 */
export const ParseMatrixList = (C, S) => {
  const parseS = new ParseSetup(S);
  const fractionResult = parseS.getFractionResult();
  const regx = /M([A-DT])(\d)(\d)([\dA]+)/g;
  let match;
  const result = [];
  while ((match = regx.exec(C)) !== null) {
    const name = match[1] === 'T' ? `MatAns` : `Mat${match[1]}`;
    let m = parseInt(match[2]);
    let n = parseInt(match[3]);
    const [latex, decimal, element] = ParseMatrix(match[4], m, n, fractionResult);
    result.push({ name, latex, decimal, element });
  }
  return result;
}

/**
 * @param {string} vector
 * @param {number} n
 * @param {string} [fractionResult]
 */
const ParseVector = (vector, n, fractionResult) => {
  const split = vector.match(/.{20}/g);
  if (n !== split.length) {
    throw new Error('Vector size not match');
  }

  const decimalResult = [];
  const element = [];
  let latexResult = '\\begin{bmatrix}';
  for (let i = 0; i < n; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get({ fractionResult });
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

/**
 *
 * @param {string} C
 * @param {string} S
 * @return {*[]}
 */
export const ParseVectorList = (C, S) => {
  const parseS = new ParseSetup(S);
  const fractionResult = parseS.getFractionResult();
  const regx = /V([A-CT])(\d)(\d)([\dA]+)/g;
  let match;
  const result = [];
  while ((match = regx.exec(C)) !== null) {
    const name = match[1] === 'T' ? `VctAns` : `Vct${match[1]}`;
    const n = parseInt(match[3]);
    const [latex, decimal, element] = ParseVector(match[4], n, fractionResult);
    result.push({ name, latex, decimal, element });
  }
  return result;
}

/**
 *
 * @param {string} C
 * @param {string} M
 * @param {string} S
 * @return {{latex: *, decimal: *[], element: *[]}}
 */
export const ParseEquation = (C, M, S) => {
  const parseS = new ParseSetup(S);
  const fractionResult = parseS.getFractionResult();
  const split = C.match(/.{20}/g);
  const parseM = new ParseMode(M);
  const mainMode = parseM.getMainMode();
  let subMode = parseM.getSubMode();
  let equType, m, n;
  switch (mainMode) {
    case '45':
      equType = 'EQUATION';
      [m, n] = INPUT_INFO_COEFFICIENT[equType][subMode];
      break;
    case '4A':
      equType = 'RATIO';
      m = 1;
      n = 3;
      break;
    case '4B':
      equType = 'INEQUALITY';
      m = 1;
      n = subMode - 1;
      break;
  }

  if (split.length !== m * n) {
    throw new Error('Equation template not match');
  }

  let k = 0;
  const decimalResult = [];
  const element = [];
  let template;
  template = INPUT_INFO[equType][subMode].map(row => {
    let needPlus = false;
    let elementRow = [];
    let c = 0;
    const newRow = row.map(cell => {
      let temp = cell;
      const placeholder = '${' + k + '}';
      if (!temp.includes(placeholder)) return temp;

      let [latex, decimal] = new ParseVariable(split[k]).get({ fractionResult });
      k++;
      elementRow.push(latex);
      decimalResult.push(decimal);

      if (/[xyzt]/.test(temp)) {
        if (decimal.eq(1)) {
          latex = '';
        } else if (decimal.eq(-1)) {
          latex = '-';
        } else if (decimal.eq(0)) {
          temp = '';
        }
      }
      if (temp === placeholder && decimal.eq(0)) {
        temp = '';
      }
      if (temp.indexOf(placeholder) !== 0) {
        needPlus = false;
      }
      if (needPlus && decimal.gte(0)) {
        latex = '+' + latex;
      }

      const replaced = temp.replace(placeholder, latex)

      if (temp) {
        c++;
        needPlus = true;
      } else if (c === 0) {
        needPlus = false;
      } else {
        needPlus = true;
      }
      return replaced;
    });
    element.push(elementRow);
    return newRow;
  });

  if (equType === 'INEQUALITY') {
    template[0].push(INPUT_INFO[equType][parseM.getInqType()]);
  }
  template = template.map(t => t.join(' ')).join(' \\\\ ');

  if (template.includes('$')) {
    throw new Error('Equation template not match');
  }
  return { latex: template, decimal: decimalResult, element };
}

/**
 * @param C
 * @param M
 * @return {{latex: *, decimal: *[]}}
 */
export const ParseDistribution = (C, M) => {
  const subMode = new ParseMode(M).getSubMode();
  const split = C.match(/.{20}/g);
  let template = INPUT_INFO['DISTRIBUTION'][subMode][split.length]
    .map(i => typeof i === 'function' ? i() : i)
    .join(' \\\\ ');

  const decimalResult = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get();
    template = template.replace(`\$\{${i}\}`, latex);
    decimalResult.push(decimal);
  }
  return { latex: template, decimal: decimalResult };
}
