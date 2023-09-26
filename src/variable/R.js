import { ParseVariable } from "./index.js";
import { AsciiTable } from "../ascii/index.js";
import { langDictToList } from "../mode/index.js";
import resultInfo from './result.json' assert { type: "json" };

export const ParseNumberResult = (R, M, modelType, modelId) => {
  const ans1 = R.slice(0, R.length / 2);
  const ans2 = R.slice(R.length / 2);
  const [ans1Latex, ans1Decimal] = new ParseVariable(ans1).get();
  const [ans2Latex, ans2Decimal] = new ParseVariable(ans2).get();

  let template = resultInfo['NUMBER'][M.slice(4, 6)];
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
    template = template.template;
    template = template.replace('${0}', ans1Latex);
    template = template.replace('${1}', ans2Latex);
    if (template.includes('${2}')) {
      const varCode = M.slice(8, 10);
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
  if (!result.template) {
    return { name: langDictToList(result.name) };
  }
  const split = R.slice(4).match(/.{20}/g);
  let template = result.template;
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

export const ParseEquationResult = (R, M, S) => {
  let resultCode = R.slice(2, 3);
  if (['1', '2', '4'].includes(resultCode)) {
    return { name: langDictToList(resultInfo['EQUATION'][resultCode].name) };
  }
  const noLocal = resultCode === '5';
  // when resultCode is '5', it still contains roots data, but indicates no Local Minimum/Maximum
  // just set to 0 to get the template
  resultCode = '0';

  const split = R.slice(3).match(/.{20}/g);
  let template;
  const subMode = M.slice(2, 4);
  if (['01', '02', '03'].includes(subMode)) {
    template = resultInfo['EQUATION'][resultCode][subMode].template;
  } else {
    if (resultInfo['EQUATION'][resultCode][subMode][split.length]['complexSetting']) {
      const complexSetting = S.slice(16, 17)
      template = resultInfo['EQUATION'][resultCode][subMode][split.length].template[complexSetting];
    } else {
      template = resultInfo['EQUATION'][resultCode][subMode][split.length].template;
    }
  }

  let result = [];
  if (['01', '02', '03'].includes(subMode)) {
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
      const numberResult = ParseNumberResult(split[2 * i] + split[2 * i + 1], M);
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
    const [, firstDecimal] = new ParseVariable(split[0]).get();
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
    result.unshift(resultInfo['EQUATION']['5']);
  }
  result.unshift({ name: 'templated', latex: template });
  return result;
}
