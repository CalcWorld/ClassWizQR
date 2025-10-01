import { modelCY } from './CY.js';
import { modelEY } from './EY.js';

export const MODEL_TYPE = {
  CY: 'CY',
  EY: 'EY',
}

export const getModelInfo = (model, type) => {
  return (type === MODEL_TYPE.EY ? modelEY[model] : modelCY[model]) || [undefined, undefined];
}

export const MODEL_TYPE_NAME = {
  [MODEL_TYPE.CY]: 'ClassWiz EX',
  [MODEL_TYPE.EY]: 'ClassWiz CW',
};

export const MODEL_PREFIX = {
  CY: 'CY',
  EY: 'EY',
  FY: 'FY',
}
