import { tt } from "../utils.js";
import { MODEL_TYPE_EY_FY } from '../model/index.js';

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

  getModeInfo(modelType) {
    const mainMode = this.getMainMode();
    if (mainMode.startsWith('X') || mainMode.startsWith('Y') || mainMode.startsWith('Z')) {
      let mainName;
      if (MODEL_TYPE_EY_FY.includes(modelType)) {
        mainName = tt(`menu.${mainMode}-${modelType}`) || tt(`menu.${mainMode}`);
      } else {
        mainName = tt(`menu.${mainMode}`);
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
    const subName = tt(`mode.${mainMode}${subMode}`);
    return { mainName, subName };
  }

  getGetStarted() {
    return { mainName: tt(`menu.GS`) };
  }
}
