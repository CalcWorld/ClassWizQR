import { ParseVariable } from "./index.js";
import { MODEL_TYPE_EY_FY } from "../model/index.js";

export const ParseVariableList = (variable, modelType) => {
  const varIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'y'];
  MODEL_TYPE_EY_FY.includes(modelType) ? varIndex.push('z') : varIndex.push('M');
  const split = variable.match(/.{9}/g);
  const result = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(split[i].match(/^[0-9]+$/) ? `0${split[i]}` : split[i]).get();
    result.push({ name: varIndex[i], latex, decimal });
  }
  return result;
}
