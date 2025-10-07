import { ParseVariable } from "./index.js";
import { tt } from "../utils.js";

export const ParseTableRange = (parameter) => {
  const split = parameter.match(/.{9}/g);
  const result = [];
  for (let i = 0; i < split.length; i++) {
    const [latex, decimal] = new ParseVariable(`0${split[i]}`).get();
    result.push({ name: tt(`input.TABLE.${i}`), latex, decimal });
  }
  return result;
}
