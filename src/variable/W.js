import { tt } from "../utils.js";
import { ParseVariable } from "./index.js";

const parseGraphCode = (block) => {
  const variable = /^[0-9]+$/.test(block) ? `0${block}` : block;
  const [, decimal] = new ParseVariable(variable).get();
  return decimal.toString();
};

export const ParseGraph = ({ W }) => {
  if (!W || W.length !== 36) return;

  const codes = Array.from(
    { length: 2 },
    (_, index) => parseGraphCode(W.slice(index * 9, (index + 1) * 9)),
  );
  const definitions = [
    ['FX_ENABLED', 'ENABLED', codes[0]],
    ['GX_ENABLED', 'ENABLED', codes[1]],
  ];

  return definitions.map(([type, valueType, code]) => ({
    name: tt(`graph.${type}.name`),
    value: tt(`graph.${valueType}.${code}`) || code,
    type,
    code,
  }));
};
