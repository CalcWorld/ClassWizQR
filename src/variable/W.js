import { tt } from "../utils.js";
import { ParseVariable } from "./index.js";

const parseGraphCode = (block) => {
  const variable = /^[0-9]+$/.test(block) ? `0${block}` : block;
  const [, decimal] = new ParseVariable(variable).get();
  return decimal.valueOf();
};

export const ParseGraph = ({ W }) => {
  const blocks = W?.match(/.{9}/g) || [];

  return blocks.map((block, index) => {
    const code = parseGraphCode(block);
    if (index < 2) {
      const type = index === 0 ? 'FX_ENABLED' : 'GX_ENABLED';
      return {
        name: tt(`graph.${type}.name`),
        value: tt(`graph.ENABLED.${code}`) || code,
        type,
        code,
      };
    }

    const reservedIndex = index - 1;
    return {
      name: `${tt('graph.RESERVED_VALUE')} ${reservedIndex}`,
      value: code,
      type: `RESERVED_VALUE_${reservedIndex}`,
      code,
    };
  });
};
