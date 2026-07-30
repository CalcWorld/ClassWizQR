const MODEL_PROFILE_GROUPS = [
  {
    profile: {
      locale: 'jp',
    },
    models: {
      CY: ['240', '241', '242', '243'],
      EY: ['029', '030', '031', '032'],
      FY: ['529', '530', '531', '532'],
    },
  },
  {
    profile: {
      locale: 'fr',
      decimalMark: 'comma',
    },
    models: {
      CY: ['246', '295'],
      EY: ['006', '090', '091'],
      FY: ['506'],
    },
  },
  {
    profile: {
      decimalMark: 'comma',
      recurringDecimal: 'overline',
    },
    models: {
      CY: ['215'],
      EY: ['012', '014', '015', '016', '047'],
    },
  },
  {
    profile: {
      decimalMark: 'comma',
    },
    models: {
      CY: ['217', '247', '250', '251', '270', '272', '291', '294'],
      EY: ['007', '021', '036', '039'],
      FY: ['521'],
    },
  },
  {
    profile: {
      recurringDecimal: 'overline',
    },
    models: {
      CY: ['216', '252', '253', '254', '255', '266', '267', '268', '269', '296'],
      EY: ['008', '009', '010', '011', '013'],
      FY: ['544'],
    },
  },
  {
    profile: {
      recurringDecimal: 'bracket',
    },
    models: {
      CY: ['298'],
      EY: ['023'],
      FY: ['523'],
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
  const group = MODEL_PROFILE_GROUPS.find(
    ({ models }) => models[modelType]?.includes(modelId),
  );

  return group ? { ...group.profile } : {};
};
