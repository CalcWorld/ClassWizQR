import { ascii00, ascii00_EY, ascii00_unicode, ascii00_unicode_EY } from './00.js';
import { asciiFA } from './FA.js';
import { asciiFB, asciiFB_EY } from './FB.js';
import { asciiFD, asciiFD_unicode } from './FD.js';
import { asciiFE, asciiFE_JP } from './FE.js';
import { MODEL_TYPE, MODEL_TYPE_EY_FY } from "../model/index.js";

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
};

export class AsciiTable {
  constructor(modelType, modelId) {
    this.modelType = modelType;
    this.modelId = modelId;
  }

  /**
   *
   * @param {'latex'|'unicode'} [type='latex']
   */
  get(type = 'latex') {
    const asciiCopy = {};

    const combine = (prefix, map, removeLatex = false) => {
      for (const key in map) {
        asciiCopy[`${prefix}${key}`] = removeLatex ?
          map[key].replace(/\\circ/g, '·')
            .replace(/\\ /g, ' ')
            .replace(/\\cdot /g, '°')
            .replace(/\\to /g, '→')
            .replace(/\\mathrm/g, '')
            .replace(/\{/g, '')
            .replace(/}/g, '')
          // .replace(/\\/g, '')
          : map[key];
      }
    }

    combine('', ascii00);
    type === 'unicode' && combine('', ascii00_unicode);
    if (MODEL_TYPE_EY_FY.includes(this.modelType)) {
      combine('', ascii00_EY);
      type === 'unicode' && combine('', ascii00_unicode_EY);
    }

    combine('FA', asciiFA, type === 'unicode');

    combine('FB', asciiFB, type === 'unicode');
    if (MODEL_TYPE_EY_FY.includes(this.modelType)) {
      combine('FB', asciiFB_EY, type === 'unicode');
    }

    combine('FD', asciiFD);
    type === 'unicode' && combine('FD', asciiFD_unicode);

    combine('FE', asciiFE, type === 'unicode');
    if (JP_MODEL[this.modelType]?.includes(this.modelId)) {
      combine('FE', asciiFE_JP, type === 'unicode');
    }

    return asciiCopy;
  }
}

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
]

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
};

export const REC_DEC_BRACKET_MODEL = {
  [MODEL_TYPE.CY]: [
    '298',
  ],
  [MODEL_TYPE.EY]: [
    '023',
  ],
};
