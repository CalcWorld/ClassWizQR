import { modelCY } from './CY.js';
import { modelEY } from './EY.js';
import { modelFY } from './FY.js';

export const MODEL_TYPE = {
  CY: 'CY',
  EY: 'EY',
  FY: 'FY',
}

export const MODEL_TYPE_EY_FY = [
  MODEL_TYPE.EY,
  MODEL_TYPE.FY,
];

const MODEL_INFO = {
  [MODEL_TYPE.CY]: modelCY,
  [MODEL_TYPE.EY]: modelEY,
  [MODEL_TYPE.FY]: modelFY,
}

export const getModelInfo = (model, type) => {
  return MODEL_INFO[type]?.[model] || [void 0, void 0];
}

export const MODEL_TYPE_NAME = {
  [MODEL_TYPE.CY]: 'ClassWiz EX',
  [MODEL_TYPE.EY]: 'ClassWiz CW',
  [MODEL_TYPE.FY]: 'ClassWiz CW+',
};
