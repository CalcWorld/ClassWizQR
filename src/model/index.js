import { modelCY } from './CY.js';
import { modelEY } from './EY.js';
import { modelFY } from './FY.js';

export const MODEL_TYPE = {
  CY: 'CY',
  EY: 'EY',
  FY: 'FY',
};

export const MODEL_TYPE_EY_FY = [
  MODEL_TYPE.EY,
  MODEL_TYPE.FY,
];

const MODEL_FEATURES = [
  {
    capabilities: {
      locale: 'jp',
    },
    models: {
      [MODEL_TYPE.CY]: ['240', '241', '242', '243'],
      [MODEL_TYPE.EY]: ['029', '030', '031', '032'],
      [MODEL_TYPE.FY]: ['529', '530', '531', '532'],
    },
  },
  {
    capabilities: {
      locale: 'fr',
    },
    models: {
      [MODEL_TYPE.CY]: ['246', '295'],
      [MODEL_TYPE.EY]: ['006', '090', '091'],
      [MODEL_TYPE.FY]: ['506'],
    },
  },
  {
    capabilities: {
      decimalMark: 'comma',
    },
    models: {
      [MODEL_TYPE.CY]: ['215', '217', '246', '247', '250', '251', '270', '272', '291', '294', '295'],
      [MODEL_TYPE.EY]: ['006', '007', '012', '014', '015', '016', '021', '036', '039', '047', '090', '091'],
      [MODEL_TYPE.FY]: ['506', '521'],
    },
  },
  {
    capabilities: {
      recurringDecimal: 'overline',
    },
    models: {
      [MODEL_TYPE.CY]: ['215', '216', '252', '253', '254', '255', '266', '267', '268', '269', '296'],
      [MODEL_TYPE.EY]: ['008', '009', '010', '011', '012', '013', '014', '015', '016', '047'],
      [MODEL_TYPE.FY]: ['544'],
    },
  },
  {
    capabilities: {
      recurringDecimal: 'bracket',
    },
    models: {
      [MODEL_TYPE.CY]: ['298'],
      [MODEL_TYPE.EY]: ['023'],
      [MODEL_TYPE.FY]: ['523'],
    },
  },
];

/**
 * Returns only the non-default capabilities for a model.
 *
 * Missing properties mean the default behavior:
 * - locale: standard labels
 * - decimalMark: dot
 * - recurringDecimal: dots above the first and last recurring digits
 *
 * @param {string} modelType
 * @param {string} modelId
 * @return {{locale?: 'fr'|'jp', decimalMark?: 'comma', recurringDecimal?: 'overline'|'bracket'}}
 */
export const getModelProfile = (modelType, modelId) => {
  const profile = {};

  for (const { capabilities, models } of MODEL_FEATURES) {
    if (models[modelType]?.includes(modelId)) {
      Object.assign(profile, capabilities);
    }
  }

  return profile;
};

const MODEL_INFO = {
  [MODEL_TYPE.CY]: modelCY,
  [MODEL_TYPE.EY]: modelEY,
  [MODEL_TYPE.FY]: modelFY,
}

export const getModelInfo = (type, model) => {
  return MODEL_INFO[type]?.[model] || [void 0, void 0];
}

export const MODEL_TYPE_NAME = {
  [MODEL_TYPE.CY]: 'ClassWiz EX',
  [MODEL_TYPE.EY]: 'ClassWiz CW',
  [MODEL_TYPE.FY]: 'ClassWiz CW 2nd edition',
};

export const FORCE_MODEL_PREFIX = {
  '091': MODEL_TYPE.EY,
};
