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
    if (!this.mainMode) {
      this.mainMode = this.M.slice(0, 2);
    }
    return this.mainMode;
  }

  getSubMode() {
    if (!this.subMode) {
      this.subMode = this.M.slice(2, 4);
    }
    return this.subMode;
  }

  getResultTemplate() {
    if (!this.resultTemplate) {
      this.resultTemplate = this.M.slice(4, 6);
    }
    return this.resultTemplate;
  }

  getResultFormat() {
    if (!this.reultFormat) {
      this.reultFormat = this.M.slice(6, 8);
    }
    return this.reultFormat;
  }

  getInqType() {
    if (!this.inqType) {
      this.inqType = this.M.slice(6, 8);
    }
    return this.inqType;
  }

  getSolveFor() {
    if (!this.solveFor) {
      this.solveFor = this.M.slice(8, 10);
    }
    return this.solveFor;
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
      let mainName = tt(`menu.${mainMode}`);
      if (!mainName) {
        mainName = tt(`menu.${mainMode}-${modelType}`);
      }
      return { mainName };
    }
    let subMode = this.getSubMode();
    if (mainMode === '4B') {
      subMode += this.getInqType();
    } else if (mainMode === '4F') {
      subMode = this.getResultTemplate();
    }
    const mainName = tt(`mode.${mainMode}`);
    let subName;
    subName = tt(`mode.${mainMode}${subMode}`);
    if (mainMode === '03' && subMode !== '01') {
      subName += ` [${this.getStatSubName(modelType, modelId)}]`;
    }
    return { mainName, subName };
  }

  getGetStarted() {
    return { mainName: tt(`menu.GS`) };
  }
}
