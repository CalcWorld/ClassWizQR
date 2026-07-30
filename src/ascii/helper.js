/**
 * @param {string} value
 * @return {string}
 */
export const removeLatex = (value) => value
  .replace(/\\circ/g, '°')
  .replace(/\\ /g, ' ')
  .replace(/\\cdot /g, '·')
  .replace(/\\to /g, '→')
  .replace(/\\mathrm/g, '')
  .replace(/\^\{/g, '')
  .replace(/\{/g, '')
  .replace(/}/g, '');

/**
 *
 * @param {string} text
 * @return {string[]}
 */
export const roman = text => [
  `\\mathrm{${text}}`,
  text,
];

/**
 *
 * @param {string} name
 * @return {string[]}
 */
export const romanCall = name => [
  `\\mathrm{${name}}(`,
  `${name}(`,
];
