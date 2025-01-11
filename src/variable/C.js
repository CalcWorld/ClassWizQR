import { ParseVariable } from "./index.js";
import { inputInfo } from './input.js';
import { ParseMode } from "../mode/index.js";

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

export const ParseMatrixList = (C) => {
  const regx = /M([A-DT])(\d)(\d)([\dA]+)/g;
  let match;
  const result = [];
  while ((match = regx.exec(C)) !== null) {
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

export const ParseVectorList = (C) => {
  const regx = /V([A-CT])(\d)(\d)(\d+)/g;
  let match;
  const result = [];
  while ((match = regx.exec(C)) !== null) {
    const name = match[1] === 'T' ? `VctAns` : `Vct${match[1]}`;
    const n = parseInt(match[3]);
    const [latex, decimal] = ParseVector(match[4], n);
    result.push({ name, latex, decimal });
  }
  return result;
}

export const ParseEquation = (M, C) => {
  const split = C.match(/.{20}/g);
  const parseM = new ParseMode(M);
  const mainMode = parseM.getMainMode();
  let subMode = parseM.getSubMode();
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
      subMode += parseM.getInqType();
      break;
  }
  let template = inputInfo[equType][subMode].template;
  const omitPlus = inputInfo[equType][subMode]['omitPlus'];
  const decimalResult = [];
  for (let i = 0; i < split.length; i++) {
    let [latex, decimal] = new ParseVariable(split[i]).get();
    if (!omitPlus.includes(i) && decimal.gte(0)) {
      latex = '+' + latex;
    }
    template = template.replace(`\$\{${i}\}`, latex);
    decimalResult.push(decimal);
  }
  if (template.includes('$')) {
    throw new Error('Equation template not match');
  }
  return { latex: template, decimal: decimalResult };
}

export const ParseDistribution = (M, C) => {
  const subMode = new ParseMode(M).getSubMode();
  const split = C.match(/.{20}/g);
  const distInfo = inputInfo['DISTRIBUTION'][subMode][split.length];
  let template = distInfo.template;
  if (!distInfo['i18n']) {
    template = [{ language: "Global", template: template }]
  }
  const decimalResult = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get();
    for (let j = 0; j < template.length; j++) {
      template[j].template = template[j].template.replace(`\$\{${i}\}`, latex);
    }
    decimalResult.push(decimal);
  }
  return { latex: template, decimal: decimalResult };
}
