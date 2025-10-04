import { ascii00 } from './00.js';
import { ascii00_EY } from './00_EY.js';
import { asciiFA } from './FA.js';
import { asciiFB } from './FB.js';
import { asciiFB_EY } from './FB_EY.js';
import { asciiFD } from './FD.js';
import { asciiFE } from './FE.js';
import { asciiFE_JP } from './FE_JP.js';
import { MODEL_TYPE } from "../model/index.js";
import { ascii00_unicode } from './00_unicode.js';
import { ascii00_unicode_EY } from './00_unicode_EY.js';
import { asciiFD_unicode } from './FD_unicode.js';

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

    const combine = (prefix, map) => {
      for (const key in map) {
        asciiCopy[`${prefix}${key}`] = map[key];
      }
    }
    const toUnicodeTypeOrNot = (ascii) => type === 'unicode' ? Object.fromEntries(
      Object.entries(ascii).map(([key, value]) => [
        key,
        value
          .replace(/\\circ/g, '·')
          .replace(/\\ /g, ' ')
          .replace(/\\cdot /g, '°')
          .replace(/\\to /g, '→')
          .replace(/\\mathrm/g, '')
          .replace(/\{/g, '')
          .replace(/}/g, '')
        // .replace(/\\/g, '')
      ])) : ascii;

    combine('', ascii00);
    type === 'unicode' && combine('', ascii00_unicode);
    if (this.modelType === MODEL_TYPE.EY) {
      combine('', ascii00_EY);
      type === 'unicode' && combine('', ascii00_unicode_EY);
    }

    combine('FA', toUnicodeTypeOrNot(asciiFA));

    combine('FB', toUnicodeTypeOrNot(asciiFB));
    if (this.modelType === MODEL_TYPE.EY) {
      combine('FB', toUnicodeTypeOrNot(asciiFB_EY));
    }

    combine('FD', asciiFD);
    type === 'unicode' && combine('FD', asciiFD_unicode);

    combine('FE', toUnicodeTypeOrNot(asciiFE));
    if (JPModel.includes(`${this.modelType}${this.modelId}`)) {
      combine('FE', toUnicodeTypeOrNot(asciiFE_JP));
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

export const recDecBracketModel = ['CY298', 'EY023'];
