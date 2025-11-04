import { tt } from "../utils.js";
import { MODEL_TYPE } from '../model/index.js';

export const STAT_DESC_MODEL = {
  [MODEL_TYPE.CY]: [
    '236',
    '237',
    '238',
    '239',
    '246',
    '247',
    '295',
  ],
  [MODEL_TYPE.EY]: [
    '006',
    '007',
    '012',
    '013',
    '014',
    '015',
    '021',
    '024',
    '025',
    '026',
    '027',
    '028',
    '090',
  ],
};

export class ParseMode {
  constructor(M) {
    this.M = M;
  }

  getMainMode() {
    return this.M.slice(0, 2);
  }

  getSubMode() {
    return this.M.slice(2, 4);
  }

  getResultTemplate() {
    return this.M.slice(4, 6);
  }

  getResultFormat() {
    // won't fix:
    // in a List screen (e.g. Stat variable list, Dist List, or Spreadsheet), result format is 4-6.
    // but it's useless on these cases
    const mainMode = this.getMainMode();
    const subMode = this.getSubMode();
    if ((mainMode === '45' && subMode !== '08') || ['4A', '4B'].includes(mainMode)) {
      return this.M.slice(4, 6);
    } else {
      return this.M.slice(6, 8);
    }
  }

  getResultFormatDisplay() {
    return this.getResultFormat().slice(0, 1);
  }

  getResultFormatStore() {
    return this.getResultFormat().slice(1, 2);
  }

  getInqType() {
    return this.M.slice(6, 8);
  }

  getSolveFor() {
    return this.M.slice(8, 10);
  }

  getStatSubName(modelType, modelId) {
    const subMode = this.getSubMode();
    if (['02', '03'].includes(subMode)) {
      if (STAT_DESC_MODEL[modelType]?.includes(modelId)) {
        return tt(`mode.03T.${subMode}DESC`);
      } else {
        return tt(`mode.03T.${subMode}ASC`);
      }
    } else {
      return tt(`mode.03T.${subMode}`);
    }
  }

  /**
   * @param {CY|EY|FY} modelType
   * @param {string} modelId
   */
  getModeInfo(modelType, modelId) {
    const mainMode = this.getMainMode();
    if (mainMode.startsWith('X') || mainMode.startsWith('Y') || mainMode.startsWith('Z')) {
      const mainName = tt(`menu.${mainMode}`) || tt(`menu.${mainMode}-${modelType}`);
      return { mainName, mainMode };
    }
    let subMode = this.getSubMode();
    if (mainMode === '4B') { // Inequality
      subMode += this.getInqType();
    } else if (mainMode === '4F') { // Math Box
      subMode = this.getResultTemplate();
    }
    const mainName = tt(`mode.${mainMode}`);
    let subName;
    subName = tt(`mode.${mainMode}${subMode}`);
    if (mainMode === '03' && subMode !== '01') {
      subName += ` [${this.getStatSubName(modelType, modelId)}]`;
    }
    return { mainName, subName, mainMode, subMode };
  }

  getGetStarted() {
    return { mainName: tt(`menu.GS`) };
  }

  getFormatInfo() {
    const formatCode = this.getResultFormat().split('');
    const [displayCode, storeCode] = formatCode;
    const [displayName, storeName] = formatCode.map(f => tt(`format.${f}`));

    return { displayName, storeName, displayCode, storeCode };
  }
}
