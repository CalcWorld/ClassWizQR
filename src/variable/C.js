import { ParseVariable } from "./index.js";
import { INPUT_INFO } from './template/input.js';
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
 * @param {{C: string, S: string}} payload
 * @return {*[]}
 */
export const ParseMatrixList = ({ C, S }) => {
  const parseS = new ParseSetup({ S });
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
 * @param {{C: string, S: string}} payload
 * @return {*[]}
 */
export const ParseVectorList = ({ C, S }) => {
  const parseS = new ParseSetup({ S });
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
 * Render one row while tracking signs independently on each side of `=`.
 * Equation coefficient terms only use x, y, z, and t in the fixed templates.
 */
const renderEquationRow = (row, coefficientChunks, fractionResult) => {
  const cells = [];
  const decimal = [];
  const element = [];
  let termCount = 0;
  let hasRelation = false;

  for (const cell of row) {
    if (cell === '=') {
      if (termCount === 0) cells.push('0');
      cells.push(cell);
      hasRelation = true;
      termCount = 0;
      continue;
    }

    const placeholderMatch = cell.match(/\$\{(\d+)}/);
    if (!placeholderMatch) {
      cells.push(cell);
      continue;
    }

    const placeholder = placeholderMatch[0];
    const coefficientIndex = Number(placeholderMatch[1]);
    let [latex, value] = new ParseVariable(
      coefficientChunks[coefficientIndex]
    ).get({ fractionResult });
    element.push(latex);
    decimal.push(value);

    let cellTemplate = cell;
    if (/[xyzt]/.test(cellTemplate)) {
      if (value.eq(1)) {
        latex = '';
      } else if (value.eq(-1)) {
        latex = '-';
      } else if (value.eq(0)) {
        cellTemplate = '';
      }
    } else if (cellTemplate === placeholder && value.eq(0)) {
      cellTemplate = '';
    }

    const placeholderStartsCell = cellTemplate.indexOf(placeholder) === 0;
    if (termCount > 0 && placeholderStartsCell && value.gte(0)) {
      latex = '+' + latex;
    }

    const rendered = cellTemplate.replace(placeholder, latex);
    if (!rendered) continue;

    cells.push(rendered);
    termCount++;
  }

  if (hasRelation && termCount === 0) cells.push('0');
  return { cells, decimal, element };
};

/**
 *
 * @param {{C: string, M: string, S: string}} payload
 * @return {{latex: *, decimal: *[], element: *[]}}
 */
export const ParseEquation = ({ C, M, S }) => {
  const parseS = new ParseSetup({ S });
  const fractionResult = parseS.getFractionResult();
  if (typeof C !== 'string' || C.length === 0 || C.length % 20 !== 0) {
    throw new Error('Equation template not match');
  }
  const split = C.match(/.{20}/g);
  const parseM = new ParseMode({ M });
  const mainMode = parseM.getMainMode();
  const subMode = parseM.getSubMode();
  const sb = +subMode;
  const equType = {
    '45': 'EQUATION',
    '4A': 'RATIO',
    '4B': 'INEQUALITY',
  }[mainMode];
  const inputTemplate = INPUT_INFO[equType]?.[subMode];
  const placeholderCount = inputTemplate?.flat().reduce(
    (count, cell) => count + (cell.match(/\$\{\d+}/g)?.length ?? 0),
    0
  );
  if (!inputTemplate || split.length !== placeholderCount) {
    throw new Error('Equation template not match');
  }

  const decimalResult = [];
  const element = [];
  let template = inputTemplate.map(row => {
    const rendered = renderEquationRow(row, split, fractionResult);
    decimalResult.push(...rendered.decimal);
    element.push(rendered.element);
    return rendered.cells;
  });

  const hasRelation = inputTemplate.some(row => row.some(cell => cell.includes('=')));

  switch (mainMode) {
    case '45':
      if (sb <= 3) {
        template[0].unshift("\\left\\{\\begin{array}{l}");
        template[sb].push("\\end{array}\\right.");
      } else if (!hasRelation) {
        template[0].push("=", "0");
      }
      break;
    case '4B':
      template[0].push(INPUT_INFO[equType][parseM.getInqType()]);
      break;
  }

  template = template.map(t => t.join(' ')).join(' \\\\ ');

  if (template.includes('$')) {
    throw new Error('Equation template not match');
  }
  return { latex: template, decimal: decimalResult, element };
}

/**
 * @param {{C: string, M: string}} payload
 * @return {{latex: *, decimal: *[]}}
 */
export const ParseDistribution = ({ C, M }) => {
  const subMode = new ParseMode({ M }).getSubMode();
  const split = C.match(/.{20}/g);
  let template = INPUT_INFO['DISTRIBUTION'][subMode][split.length];
  if (split.length !== template.length) {
    throw new Error('Distribution template not match');
  }

  const decimalResult = [];
  template = template.map((cell, i) => {
    let temp = typeof cell === 'function' ? cell() : cell;
    const [latex, decimal] = new ParseVariable(split[i]).get();
    temp = temp.replace('${' + i + '}', latex);
    decimalResult.push(decimal);
    return temp;
  })
    .join(' \\\\ ');

  return { latex: template, decimal: decimalResult };
}

export const ParseSequenceSetting = ({ C, E, G }) => {
  const split = C.match(/.{20}/g);
  const parameter = split.map(i => {
    const [latex, decimal] = new ParseVariable(i).get();
    return { latex, decimal };
  });
  const setting = {
    parameter,
  };

  setting.firstTermIsA0 = parameter[2].decimal.eq(8);

  if (parameter[0].decimal.eq(2)) {
    setting.seq1 = { type: 'uₙ₊₁', firstTerm: setting.firstTermIsA0 ? 'u₀' : 'u₁' };
  } else {
    setting.seq1 = { type: 'uₙ', firstTerm: null };
  }

  if (parameter[1].decimal.eq(4)) {
    setting.seq2 = { type: 'vₙ₊₁', firstTerm: setting.firstTermIsA0 ? 'v₀' : 'v₁' };
  } else {
    setting.seq2 = { type: 'vₙ', firstTerm: null };
  }

  setting.displaySum = parameter[3].decimal.eq(1);

  setting.resultHeader = [
    'n',
    E?.length > 0 ? 'uₙ' : void 0,
    E?.length > 0 && setting.displaySum ? 'Σuₙ' : void 0,
    G?.length > 0 ? 'vₙ' : void 0,
    G?.length > 0 && setting.displaySum ? 'Σvₙ' : void 0,
  ].filter(Boolean);

  return setting;
};
