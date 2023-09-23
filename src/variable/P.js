import { ParseVariable } from "./index.js";

export const ParseTableRange = (parameter) => {
  const rangeIndex = ['Start', 'End', 'Step'];
  const split = parameter.match(/.{9}/g);
  const result = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(`0${split[i]}`).get();
    result.push({ name: rangeIndex[i], latex, decimal });
  }
  return result;
}
