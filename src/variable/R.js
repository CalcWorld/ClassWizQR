import { ParseVariable } from "./index.js";
import { AsciiTable } from "../ascii/index.js";
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
    return result;
  }
  const split = R.slice(4).match(/.{20}/g);
  let template = result.template;
  const returnResult = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(split[i]).get();
    template = template.replace(`\$\{${i}\}`, latex);
    returnResult.push({ name: `Part${i + 1}`, latex, decimal });
  }
  returnResult.unshift({ name: 'templated', latex: template });
  return returnResult;
}
