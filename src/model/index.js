import { modelCY } from './CY.js';
import { modelEY } from './EY.js';

export const MODEL_TYPE = {
  CY: 'CY',
  EY: 'EY',
}

export const getModelInfo = (model, type) => {
  return (type === MODEL_TYPE.EY ? modelEY[model] : modelCY[model]) || [undefined, undefined];
}
