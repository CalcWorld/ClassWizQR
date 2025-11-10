import { ParseVariable } from "./index.js";
import { INPUT_INFO, INPUT_INFO_COEFFICIENT, INPUT_INFO_OMIT_PLUS } from './input.js';
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
  let equType, omitPlus, m, n;
  switch (mainMode) {
    case '45':
      equType = 'EQUATION';
      omitPlus = INPUT_INFO_OMIT_PLUS[equType][subMode] || [0];
      [m, n] = INPUT_INFO_COEFFICIENT[equType][subMode];
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

  let template = INPUT_INFO[equType][subMode];
  const decimalResult = [];
  const element = [];
  let elementRow = [];
  let i;
  for (i = 0; i < split.length; i++) {
    let [latex, decimal] = new ParseVariable(split[i]).get({ fractionResult });
    elementRow.push(latex);
    decimalResult.push(decimal);
    if ((i + 1) % n === 0) {
      element.push(elementRow);
      elementRow = [];
    }

    const search = `\$\{${i}\}`;
    const searchPos = template.indexOf(search);
    const charPos = searchPos + search.length;
    const char = template[charPos];
    /*if (decimal.eq(0)) {
      const next = template.slice(charPos).search(/[$=\\]/);
      console.log(i, template.slice(charPos))
      if (next !== -1) {
        template = template.slice(0, searchPos) + template.slice(charPos + next);
        continue;
      }
    }*/
    if (/[xyzt]/.test(char)) {
      if (decimal.eq(1)) {
        latex = '';
      } else if (decimal.eq(-1)) {
        latex = '-';
      }
    }
    if (!omitPlus.includes(i) && decimal.gte(0)) {
      latex = '+' + latex;
    }
    template = template.replace(search, latex);
  }
  if (i !== m * n || template.includes('$')) {
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
