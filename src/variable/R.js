import { ParseVariable } from "./index.js";
import { AsciiTable } from "../ascii/index.js";
import resultInfo from './result.json' assert { type: "json" };

export const ParseNumber = (R, M, modelType, modelId) => {
  const ans1 = R.slice(0, R.length / 2);
  const ans2 = R.slice(R.length / 2);
  const [ans1Latex, ans1Decimal] = new ParseVariable(ans1).get();
  const [ans2Latex, ans2Decimal] = new ParseVariable(ans2).get();

  let template = resultInfo['NUMBER'][M.slice(4, 6)];
  let result = [];
  if (!template) {
    if (ans2Decimal.eq(0)) {
      result.push({ name: 'templated', latex: ans1Latex });
    } else if (ans2Decimal.eq(1)) {
      result.push({ name: 'templated', latex: `${ans1Latex} + i` });
    } else if (ans2Decimal.gt(0)) {
      result.push({ name: 'templated', latex: `${ans1Latex} + ${ans2Latex}i` });
    } else if (ans2Decimal.eq(-1)) {
      result.push({ name: 'templated', latex: `${ans1Latex} - i` });
    } else {
      result.push({ name: 'templated', latex: `${ans1Latex} ${ans2Latex}i` });
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
    result.push({ name: 'templated', latex: template });
  }
  result.push({ name: 'Part1', latex: ans1Latex, decimal: ans1Decimal })
  result.push({ name: 'Part2', latex: ans2Latex, decimal: ans2Decimal })
  return result;
}
