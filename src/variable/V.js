import { ParseVariable } from "./index.js";

export const ParseVariableList = (variable, modelType) => {
  const varIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'y'];
  modelType === 'CY' ? varIndex.push('M') : varIndex.push('z');
  const split = variable.match(/.{9}/g);
  const result = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(`0${split[i]}`).get();
    result.push({ name: varIndex[i], latex, decimal });
  }
  return result;
}
