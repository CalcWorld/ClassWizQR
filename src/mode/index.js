import { menuInfo } from './menu.js';
import { modeInfo } from './mode.js';

export const langDictToList = (dict) => {
  const list = [];
  for (const key in dict) {
    list.push({ region: key, name: dict[key] });
  }
  return list;
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
      return langDictToList(menuInfo[mainMode]['name']);
    }
    let subMode = this.getSubMode();
    if (mainMode === '4B') {
      subMode += this.getInqType();
    }
    const mainName = langDictToList(modeInfo[mainMode]['name']);
    let subName = modeInfo[mainMode]['subMode'][subMode];
    subName = subName ? langDictToList(subName['name']) : [];
    return { mainName, subName };
  }
}