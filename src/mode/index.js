import { menuInfo } from './menu.js';
import { modeInfo } from './mode.js';

export const translate = (dict) => {
  return dict[globalThis.cwqrConfig.language] || dict['en'];
}

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

  getModeInfo() {
    const mainMode = this.getMainMode();
    if (mainMode.startsWith('X') || mainMode.startsWith('Y') || mainMode.startsWith('Z')) {
      return { mainName: translate(menuInfo[mainMode]['name']) };
    }
    let subMode = this.getSubMode();
    if (mainMode === '4B') {
      subMode += this.getInqType();
    }
    const mainName = translate(modeInfo[mainMode]['name']);
    let subName = (modeInfo[mainMode]['subMode'] || {})[subMode];
    subName = subName ? translate(subName['name']) : undefined;
    return { mainName, subName };
  }
}