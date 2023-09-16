const modelCY = require('./CY.json');
const modelEY = require('./EY.json');

export const getModelInfo = (model, type) => {
  return (type === 'CY' ? modelCY[model] : modelEY[model]) || [undefined, undefined];
}
