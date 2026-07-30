export const removeLatex = (value) => value
  .replace(/\\circ/g, '°')
  .replace(/\\ /g, ' ')
  .replace(/\\cdot /g, '·')
  .replace(/\\to /g, '→')
  .replace(/\\mathrm/g, '')
  .replace(/\^\{/g, '')
  .replace(/\{/g, '')
  .replace(/}/g, '');
