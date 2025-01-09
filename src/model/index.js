import { modelCY } from './CY.js';
import { modelEY } from './EY.js';

export const getModelInfo = (model, type) => {
  return (type === 'CY' ? modelCY[model] : modelEY[model]) || [undefined, undefined];
}
