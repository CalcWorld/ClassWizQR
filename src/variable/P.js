import { ParseVariable } from "./index.js";
import { translate } from "../mode/index.js";

export const ParseTableRange = (parameter) => {
  const rangeIndex = translate({
    'en': ['Start', 'End', 'Step'],
    'zh': ['开始值', '终止值', '步长'],
  });
  const split = parameter.match(/.{9}/g);
  const result = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(`0${split[i]}`).get();
    result.push({ name: rangeIndex[i], latex, decimal });
  }
  return result;
}
