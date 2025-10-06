import { AsciiTable, mathTemplate, recDecBracketModel, recDecOverlineModel } from "../ascii/index.js";
import { ParseMode } from "../mode/index.js";
import { ParseSetup } from "../setup/index.js";
import { toAsciiArray } from '../utils.js';
import { MODEL_TYPE } from '../model/index.js';

export class ParseExpression {
  constructor(E, modelType, modelId) {
    this.E = E;
    this.modelType = modelType;
    this.modelId = modelId;
    this.asciiTable = new AsciiTable(modelType, modelId).get();
  }

  parseLine() {
    const asciiArray = toAsciiArray(this.E);
    return asciiArray.map(a => this.asciiTable[a]).join(' ');
  }

  _setRecDecType() {
    if (recDecOverlineModel.includes(`${this.modelType}${this.modelId}`)) {
      this.recDecType = 1;
    } else if (recDecBracketModel.includes(`${this.modelType}${this.modelId}`)) {
      this.recDecType = 2;
    } else {
      this.recDecType = 0;
    }
  }

  _parseToTree() {
    let text = this.E;
    text = text.replaceAll('1F1D1A', '1A');
    text = text.replaceAll('1D1A', '1A');
    text = text.replaceAll('1B1E', '1B');
    text = text.replaceAll('1B1A', '1C');
    const asciiArray = toAsciiArray(text);
    let result = '[';
    for (let i = 0; i < asciiArray.length; i++) {
      const cur = asciiArray[i];
      const next = i + 1 < asciiArray.length ? asciiArray[i + 1] : null;
      if (mathTemplate.includes(cur) && next === '1A') {
        result += `{"${cur}": [`;
        continue;
      }
      if (cur === '1A') {
        result += `[`;
        continue;
      }
      if (cur === '1C') {
        result = result.endsWith(', ') ? result.slice(0, -2) : result;
        result += `], [`;
        continue;
      }
      if (cur === '1B') {
        result = result.endsWith(', ') ? result.slice(0, -2) : result;
        result += `]]}, `;
        continue;
      }
      result += `"${cur}", `;
    }
    result = result.endsWith(', ') ? result.slice(0, -2) : result;
    result += ']';
    result = JSON.parse(result);
    return result;
  }

  _parseToLatex(tree) {
    let result = "";
    if (typeof tree === 'string') {
      return this.asciiTable[tree];
    }

    if (Array.isArray(tree)) {
      return tree.map(item => this._parseToLatex(item)).join(' ');
    }

    if (typeof tree === 'object') {
      const keys = Object.keys(tree);
      for (let i = 0; i < keys.length; i++) {
        const curKey = keys[i];
        const curVal = tree[curKey];
        const a = this._parseToLatex(curVal[0]);
        const b = curVal[1] ? this._parseToLatex(curVal[1]) : ' ';
        const c = curVal[2] ? this._parseToLatex(curVal[2]) : ' ';
        switch (curKey) {
          case '18':
            result += `{${a}} \\dfrac {\\displaystyle ${b}} {\\displaystyle ${c}} `;
            break;
          case '2F':
            if (!this.recDecType) {
              const n = a.replaceAll(' ', '');
              if (n.length === 1) {
                result += `\\dot{${n}} `;
                break;
              } else {
                const first = n[0];
                const last = n[n.length - 1];
                const middle = n.slice(1, -1);
                result += `\\dot{${first}}${middle}\\dot{${last}} `;
                break;
              }
            } else if (this.recDecType === 1) {
              result += `\\overline{${a}} `;
              break;
            } else if (this.recDecType === 2) {
              result += `\\left( ${a} \\right) `;
              break;
            }
            break;
          case '50':
            result += `\\sum_{x=${b}}^{${c}}{(${a})} `;
            break;
          case '51':
            result += `\\int_{${b}}^{${c}}{${a}}\\mathrm{d}x `;
            break;
          case '52':
            result += `\\dfrac{\\mathrm{d}}{\\mathrm{d}x} {(${a})} \\Bigg|_{x=${b}} `;
            break;
          case '53':
            result += `\\prod_{x=${b}}^{${c}}{(${a})} `;
            break;
          case '68':
            result += `\\left | ${a} \\right | `;
            break;
          case '72':
            result += `e^{${a}} `;
            break;
          case '73':
            result += this.modelType === MODEL_TYPE.FY ? '\\times ' : '\\ ';
            result += `10^{${a}} `;
            break;
          case '74':
            result += `\\sqrt{${a}} `;
            break;
          case '7D':
            result += `\\log_{${a}}{(${b})} `;
            break;
          case 'C8':
            result += `\\dfrac{\\displaystyle ${a}} {\\displaystyle ${b}} `;
            break;
          case 'C9':
            result += `^{${a}} `;
            break;
          case 'CA':
            result += `\\sqrt[${a}]{${b}} `;
            break;
        }
      }
      return result;
    }
  }

  parseMath() {
    this._setRecDecType();
    try {
      const tree = this._parseToTree();
      return this._parseToLatex(tree);
    } catch (e) {
      return this.parseLine();
    }
  }

  autoParse(M, S) {
    if (['88', '89', 'C1', 'C4'].includes(new ParseMode(M).getMainMode()) && new ParseSetup(S).getInputCode() === '1') {
      return this.parseMath();
    }
    return this.parseLine();
  }
}
