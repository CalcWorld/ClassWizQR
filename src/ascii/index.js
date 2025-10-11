import { ascii00, ascii00_EY, ascii00_unicode, ascii00_unicode_EY } from './00.js';
import { asciiFA } from './FA.js';
import { asciiFB, asciiFB_EY } from './FB.js';
import { asciiFD, asciiFD_unicode } from './FD.js';
import { asciiFE, asciiFE_JP } from './FE.js';
import { MODEL_TYPE_EY_FY } from "../model/index.js";

const JPModel = ['CY240', 'CY241', 'CY242', 'CY243', 'EY029', 'EY030', 'EY031', 'EY032'];

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
    if (JPModel.includes(`${this.modelType}${this.modelId}`)) {
      combine('FE', asciiFE_JP, type === 'unicode');
    }

    return asciiCopy;
  }
}

export const mathTemplate = [
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

export const recDecOverlineModel = [
  "CY215",
  "CY216",
  "CY252",
  "CY253",
  "CY254",
  "CY255",
  "CY266",
  "CY267",
  "CY268",
  "CY269",
  "CY296",

  "EY008",
  "EY009",
  "EY010",
  "EY011",
  "EY012",
  "EY013",
  "EY014",
  "EY015",
  "EY016",
  "EY047",
];

export const recDecBracketModel = [
  'CY298',
  'EY023',
];
