import { ParseVariable } from "./index.js";
import { AsciiTable } from "../ascii/index.js";
import { ParseMode } from "../mode/index.js";
import { resultInfo } from './result.js';
import { ParseSetup } from "../setup/index.js";
import { tt } from "../utils.js";

export const ParseNumberResult = (R, M, modelType, modelId) => {
  const parseM = new ParseMode(M);
  const ans1 = R.slice(0, R.length / 2);
  const ans2 = R.slice(R.length / 2);
  const [ans1Latex, ans1Decimal] = new ParseVariable(ans1).get();
  const [ans2Latex, ans2Decimal] = new ParseVariable(ans2).get();

  let template = resultInfo['NUMBER'][parseM.getResultTemplate()];
  let result = [];
  if (!template) {
    if (ans2Decimal.eq(0)) {
      template = ans1Latex;
    } else if (ans2Decimal.eq(1)) {
      template = `${ans1Latex} + i`;
    } else if (ans2Decimal.gt(0)) {
      template = `${ans1Latex} + ${ans2Latex}i`;
    } else if (ans2Decimal.eq(-1)) {
      template = `${ans1Latex} - i`;
    } else {
      template = `${ans1Latex} ${ans2Latex}i`;
    }
  } else {
    template = template.replace('${0}', ans1Latex);
    template = template.replace('${1}', ans2Latex);
    if (template.includes('${2}')) {
      const varCode = parseM.getSolveFor();
      const asciiTable = new AsciiTable(modelType, modelId).get();
      const varAscii = asciiTable[varCode];
      template = template.replace('${2}', varAscii);
    }
  }
  result.push({ name: 'templated', latex: template });
  result.push({ name: 'Part1', latex: ans1Latex, decimal: ans1Decimal })
  result.push({ name: 'Part2', latex: ans2Latex, decimal: ans2Decimal })
  return result;
}

export const ParseInequalityResult = (R) => {
  const resultCode = R.slice(2, 4);
  const result = resultInfo['INEQUALITY'][resultCode];
  if (typeof result === 'function') {
    return [{ name: 'templated', latex: result() }];
  }
  const split = R.slice(4).match(/.{20}/g);
  let template = result;
  const returnResult = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get();
    template = template.replace(`\$\{${i}\}`, latex);
    returnResult.push({ name: `Part${i + 1}`, latex, decimal });
  }
  if (template.includes('$')) {
    throw new Error('Inequality template not match');
  }
  returnResult.unshift({ name: 'templated', latex: template });
  return returnResult;
}

export const ParseEquationResult = (R, M, S, C) => {
  let resultCode = R.slice(2, 3);
  if (['1', '2', '4'].includes(resultCode)) {
    return [{ name: 'templated', latex: resultInfo['EQUATION'][resultCode](), decimal: NaN }];
  }
  const noLocal = resultCode === '5';

  const SIMUL_SUB_MODE = ['01', '02', '03'];
  const split = R.slice(3).match(/.{20}/g);
  const subMode = new ParseMode(M).getSubMode();
  let template;
  const EQ0 = resultInfo['EQUATION']['0'];
  if (SIMUL_SUB_MODE.includes(subMode)) {
    template = EQ0[subMode];
  } else {
    template = EQ0[`${subMode}-${split.length}`];
    if (!template) {
      // TODO: may be incorrect
      const complexRoot = new ParseSetup(S).getEquationComplexRootCode();
      template = EQ0[`${subMode}-${split.length}-${complexRoot}`];
    }
  }
  template = template.join(' \\\\ ');

  const result = [];
  if (SIMUL_SUB_MODE.includes(subMode)) {
    for (let i = 0; i < split.length; i++) {
      const [latex, decimal] = new ParseVariable(split[i]).get();
      template = template.replace(`\$\{${i}\}`, latex);
      result.push({ name: `Part${i + 1}`, latex, decimal });
    }
  } else {
    let rootCount;
    if (['04', '06'].includes(subMode) || ('05' === subMode && !template.includes('max'))) {
      rootCount = split.length / 2;
    } else {
      rootCount = (split.length - 4) / 2;
    }
    for (let i = 0; i < rootCount; i++) {
      const numberResult = ParseNumberResult(`${split[2 * i]}${split[2 * i + 1]}`, M);
      const latex = numberResult[0].latex;
      template = template.replace(`\$\{${i}\}`, latex);
      result.push({ name: `Part${2 * i + 1}`, latex: numberResult[1].latex, decimal: numberResult[1].decimal });
      result.push({ name: `Part${2 * i + 2}`, latex: numberResult[2].latex, decimal: numberResult[2].decimal });
    }
    if ('05' === subMode && template.includes('max')) {
      for (let i = 0; i < 4; i++) {
        const [latex, decimal] = new ParseVariable(split[rootCount * 2 + i]).get();
        template = template.replace(`\$\{${rootCount + i}\}`, latex);
        result.push({ name: `Part${rootCount * 2 + i + 1}`, latex, decimal });
      }
    }
  }

  if (template.includes('${EXT}')) {
    const [, firstDecimal] = new ParseVariable(C.slice(0, 20)).get();
    if (firstDecimal.gt(0)) {
      template = template.replaceAll('${EXT}', 'min');
    } else {
      template = template.replaceAll('${EXT}', 'max');
    }
  }
  if (template.includes('$')) {
    throw new Error('Equation template not match');
  }
  if (noLocal) {
    template += `\\\\${resultInfo['EQUATION']['5']()}`;
  }
  result.unshift({ name: 'templated', latex: template });
  return result;
}

export const ParseStatisticResult = (R, M) => {
  const split = R.match(/.{20}/g);
  const parseM = new ParseMode(M);
  const subMode = parseM.getSubMode();
  const resultType = parseM.getResultTemplate();
  let template;
  const result = [];
  switch (resultType) {
    case 'F1':
    case 'F2':
      template = resultInfo['STATISTICS'][resultType].join(' \\\\ ');
      break;
    case 'F3':
      template = tt(`mode.03${subMode}`).match(/\[.*]/g)[0];
      if (subMode === '03') {
        template += ' \\\\ a=${0} \\\\ b=${1} \\\\ c=${2}';
      } else {
        template += ' \\\\ a=${0} \\\\ b=${1} \\\\ r=${2}';
      }
      break;
  }
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get();
    template = template.replace(`\$\{${i}\}`, latex);
    result.push({ name: `Part${i + 1}`, latex, decimal });
  }
  if (template.includes('$')) {
    throw new Error('Statistic template not match');
  }
  result.unshift({ name: 'templated', latex: template });
  return result;
}
