import { MODEL_TYPE } from '../model/index.js';

export const JP_MODEL = {
  [MODEL_TYPE.CY]: [
    '240',
    '241',
    '242',
    '243',
  ],
  [MODEL_TYPE.EY]: [
    '029',
    '030',
    '031',
    '032',
  ],
  [MODEL_TYPE.FY]: [
    '529',
    '530',
    '531',
    '532',
  ],
};

export const MATH_TEMPLATE = [
  '18',  // mixed fraction
  '2F',  // recurring decimal
  '50',  // Σ
  '51',  // ∫
  '52',  // d/dx
  '53',  // π
  '68',  // abs
  '72',  // e^x
  '73',  // 10^x
  '74',  // sqrt
  '7D',  // log ab
  'C8',  // fraction
  'C9',  // ^ exponent
  'CA',  // x sqrt
];

export const REC_DEC_OVERLINE_MODEL = {
  [MODEL_TYPE.CY]: [
    "215",
    "216",
    "252",
    "253",
    "254",
    "255",
    "266",
    "267",
    "268",
    "269",
    "296",
  ],
  [MODEL_TYPE.EY]: [
    "008",
    "009",
    "010",
    "011",
    "012",
    "013",
    "014",
    "015",
    "016",
    "047",
  ],
  [MODEL_TYPE.FY]: [
    '544',
  ],
};

export const REC_DEC_BRACKET_MODEL = {
  [MODEL_TYPE.CY]: [
    '298',
  ],
  [MODEL_TYPE.EY]: [
    '023',
  ],
  [MODEL_TYPE.FY]: [
    '523',
  ],
};
