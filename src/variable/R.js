import { ParseVariable } from "./index.js";
import { AsciiTable } from "../ascii/index.js";
import { ParseMode } from "../mode/index.js";
import { RESULT_INFO } from './result.js';
import { ParseSetup } from "../setup/index.js";

export const ParseNumberResult = (R, M, modelType, modelId) => {
  const parseM = new ParseMode(M);
  const { displayCode } = parseM.getFormatInfo();
  const ans1 = R.slice(0, R.length / 2);
  const ans2 = R.slice(R.length / 2);
  const [ans1Latex, ans1Decimal] = new ParseVariable(ans1).get({ displayCode });
  const [ans2Latex, ans2Decimal] = new ParseVariable(ans2).get({ displayCode });

  let template = RESULT_INFO['NUMBER'][parseM.getResultTemplate()];
  let result = [];
  if (!template) {
    const real_is_zero = ans1Decimal.isZero();
    const imaginary_is_zero = ans2Decimal.isZero();

    let template_i;
    const plus_sign_i = real_is_zero ? '' : ' + ';
    if (ans2Decimal.eq(1)) {
      template_i = `${plus_sign_i}i`;
    } else if (ans2Decimal.gt(0)) {
      template_i = `${plus_sign_i}${ans2Latex}i`;
    } else if (ans2Decimal.eq(-1)) {
      template_i = `- i`;
    } else {
      template_i = `${ans2Latex}i`;
    }

    if (imaginary_is_zero) {
      template = ans1Latex;
    } else if (real_is_zero) {
      template = template_i;
    } else {
      template = `${ans1Latex} ${template_i}`;
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

export const ParseInequalityResult = (R, M) => {
  const parseM = new ParseMode(M);
  const { displayCode } = parseM.getFormatInfo();
  const resultCode = R.slice(2, 4);
  const result = RESULT_INFO['INEQUALITY'][resultCode];
  if (typeof result === 'function') {
    return [{ name: 'templated', latex: result() }];
  }
  const split = R.slice(4).match(/.{20}/g);
  let template = result;
  const returnResult = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get({ displayCode });
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
  const resultCode = R.slice(2, 3);
  const split = R.slice(3).match(/.{20}/g);
  const parseM = new ParseMode(M)
  const subMode = parseM.getSubMode();
  const { displayCode } = parseM.getFormatInfo();

  if (['1', '2', '4'].includes(resultCode)) {
    if (split.length === 0) {
      return [{ name: 'templated', latex: RESULT_INFO['EQUATION'][resultCode]() }];
    }
  }
  const noLocal = resultCode === '5';

  let template;
  const SIMUL_SUB_MODE = ['01', '02', '03'];
  const EQ0 = RESULT_INFO['EQUATION']['0'];
  if (SIMUL_SUB_MODE.includes(subMode)) {
    template = EQ0[subMode];
  } else {
    if (subMode === '05' && split.length === 6) {
      const complexRoot = new ParseSetup(S).getEquationComplexRootCode();
      const [, lastR] = new ParseVariable(split[split.length - 1]).get({ displayCode });
      let variants;
      if (complexRoot === '1' || lastR.isZero()) {
        variants = '1';
      } else {
        variants = '0';
      }
      template = EQ0[`${subMode}-${split.length}-${variants}`];
    } else if (subMode === '04' && split.length === 4) {
      let variants;
      if (resultCode === '4') {
        variants = '0';
        template = [RESULT_INFO['EQUATION'][resultCode]()];
      } else {
        variants = '1';
        template = [];
      }
      template = template.concat(EQ0[`${subMode}-${split.length}-${variants}`]);
    } else {
      template = EQ0[`${subMode}-${split.length}`];
    }
  }
  template = template.join(' \\\\ ');

  const result = [];
  if (SIMUL_SUB_MODE.includes(subMode)) {
    for (let i = 0; i < split.length; i++) {
      const [latex, decimal] = new ParseVariable(split[i]).get({ displayCode });
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
        const [latex, decimal] = new ParseVariable(split[rootCount * 2 + i]).get({ displayCode });
        template = template.replace(`\$\{${rootCount + i}\}`, latex);
        result.push({ name: `Part${rootCount * 2 + i + 1}`, latex, decimal });
      }
    }
  }

  if (template.includes('${EXT}')) {
    const [, firstC] = new ParseVariable(C.slice(0, 20)).get();
    if (firstC.gt(0)) {
      template = template.replaceAll('${EXT}', 'min');
    } else {
      template = template.replaceAll('${EXT}', 'max');
    }
  }
  if (template.includes('$')) {
    throw new Error('Equation template not match');
  }
  if (noLocal) {
    template += ` \\\\ ${RESULT_INFO['EQUATION']['5']()}`;
  }
  result.unshift({ name: 'templated', latex: template });
  return result;
}

export const ParseStatisticResult = (R, M, modelType, modelId) => {
  const split = R.match(/.{20}/g);
  const parseM = new ParseMode(M);
  const subMode = parseM.getSubMode();
  const resultType = parseM.getResultTemplate();
  let template;
  const result = [];
  switch (resultType) {
    case 'F1':
    case 'F2':
      template = RESULT_INFO['STATISTICS'][resultType].join(' \\\\ ');
      break;
    case 'F3':
      template = parseM.getStatSubName(modelType, modelId).replace('(bx)', '{(bx)}');
      template += ' \\\\ a=${0} \\\\ b=${1} \\\\ ';
      if (subMode === '03') {
        template += 'c=${2}';
      } else {
        template += 'r=${2}';
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
