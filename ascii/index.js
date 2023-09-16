const ascii00 = require('./00.json');
const ascii00_EY = require('./00_EY.json');
const asciiFA = require('./FA.json');
const asciiFB = require('./FB.json');
const asciiFB_EY = require('./FB_EY.json');
const asciiFD = require('./FD.json');
const asciiFE = require('./FE.json');
const asciiFE_JP = require('./FE_JP.json');

const JPModel = ['CY240', 'CY241', 'CY242', 'CY243'];

export class AsciiTable {
  constructor(modelType, modelId) {
    this.modelType = modelType;
    this.modelId = modelId;
  }

  get() {
    const asciiCopy = { ...ascii00 };
    const combine = (prefix, map) => {
      for (const key in map) {
        asciiCopy[`${prefix}${key}`] = map[key];
      }
    }

    if (this.modelType === 'EY') {
      for (const k in ascii00_EY) {
        asciiCopy[k] = ascii00_EY[k];
      }
    }
    combine('FA', asciiFA);
    combine('FB', asciiFB);
    if (this.modelType === 'EY') {
      combine('FB', asciiFB_EY);
    }
    combine('FD', asciiFD);
    combine('FE', asciiFE);
    if (JPModel.includes(`${this.modelType}${this.modelId}`)) {
      combine('FE', asciiFE_JP);
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
