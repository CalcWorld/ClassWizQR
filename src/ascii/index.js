import {
  ascii00,
  ascii00_DECIMAL_MARK_COMMA,
  ascii00_EY,
  ascii00_FR,
  ascii00_FR_EY,
  ascii00_unicode,
  ascii00_unicode_EY
} from './00.js';
import { asciiFA } from './FA.js';
import { asciiFB, asciiFB_EY } from './FB.js';
import { asciiFD, asciiFD_EY, asciiFD_FR, asciiFD_unicode } from './FD.js';
import { asciiFE, asciiFE_FY, asciiFE_JP } from './FE.js';
import { MODEL_TYPE_EY_FY } from "../model/index.js";
import { DECIMAL_MARK_COMMA_MODEL, FR_MODEL, JP_MODEL } from './consts.js';

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
    if (DECIMAL_MARK_COMMA_MODEL[this.modelType]?.includes(this.modelId)) {
      combine('', ascii00_DECIMAL_MARK_COMMA);
    }
    if (FR_MODEL[this.modelType]?.includes(this.modelId)) {
      combine('', ascii00_FR);
    }
    if (MODEL_TYPE_EY_FY.includes(this.modelType)) {
      combine('', ascii00_EY);
      type === 'unicode' && combine('', ascii00_unicode_EY);
      if (FR_MODEL[this.modelType]?.includes(this.modelId)) {
        combine('', ascii00_FR_EY);
      }
    }

    combine('FA', asciiFA, type === 'unicode');

    combine('FB', asciiFB, type === 'unicode');
    if (MODEL_TYPE_EY_FY.includes(this.modelType)) {
      combine('FB', asciiFB_EY, type === 'unicode');
    }

    combine('FD', asciiFD);
    type === 'unicode' && combine('FD', asciiFD_unicode);
    if (FR_MODEL[this.modelType]?.includes(this.modelId)) {
      combine('FD', asciiFD_FR, type === 'unicode');
    }
    if (MODEL_TYPE_EY_FY.includes(this.modelType)) {
      combine('FD', asciiFD_EY);
    }

    combine('FE', asciiFE, type === 'unicode');
    if (JP_MODEL[this.modelType]?.includes(this.modelId)) {
      combine('FE', asciiFE_JP, type === 'unicode');
    }
    if (MODEL_TYPE_EY_FY.includes(this.modelType)) {
      combine('FE', asciiFE_FY, type === 'unicode');
    }

    return asciiCopy;
  }
}
