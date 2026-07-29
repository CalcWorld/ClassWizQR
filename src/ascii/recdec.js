import { REC_DEC_BRACKET_MODEL, REC_DEC_OVERLINE_MODEL } from './consts.js';

/**
 * Converts the recurring part of a decimal to the notation used by a model.
 *
 * @param {string} recurring
 * @param {string} [modelType]
 * @param {string} [modelId]
 * @return {string}
 */
export const recDecToLatex = (recurring, modelType, modelId) => {
  if (REC_DEC_OVERLINE_MODEL[modelType]?.includes(modelId)) {
    return `\\overline{${recurring}} `;
  }
  if (REC_DEC_BRACKET_MODEL[modelType]?.includes(modelId)) {
    return `\\left( ${recurring} \\right) `;
  }

  const digits = recurring.replaceAll(' ', '');
  if (digits.length === 1) {
    return `\\dot{${digits}} `;
  }

  return `\\dot{${digits[0]}}${digits.slice(1, -1)}\\dot{${digits.at(-1)}} `;
};
