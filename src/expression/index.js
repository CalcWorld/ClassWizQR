import { AsciiTable } from "../ascii/index.js";
import { ParseMode } from "../mode/index.js";
import { ParseSetup } from "../setup/index.js";
import { toAsciiArray } from '../utils.js';
import { MODEL_TYPE } from '../model/index.js';
import { MATH_TEMPLATE } from '../ascii/consts.js';
import { recDecToLatex } from '../ascii/recdec.js';

export class ParseExpression {
  constructor({ E }, { modelType, modelId }) {
    this.E = E;
    this.modelType = modelType;
    this.modelId = modelId;
    this.asciiTable = new AsciiTable(modelType, modelId).get();
  }

  parseLine() {
    const asciiArray = toAsciiArray(this.E);
    return asciiArray.map(a => this.asciiTable[a]).join(' ');
  }

  #parseToTree() {
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
      if (MATH_TEMPLATE.includes(cur) && next === '1A') {
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
    this.tree = result;
    return result;
  }

  #parseToLatex(tree) {
    let result = "";
    if (typeof tree === 'string') {
      return this.asciiTable[tree];
    }

    if (Array.isArray(tree)) {
      return tree.map(item => this.#parseToLatex(item)).join(' ');
    }

    if (typeof tree === 'object') {
      const keys = Object.keys(tree);
      for (let i = 0; i < keys.length; i++) {
        const curKey = keys[i];
        const curVal = tree[curKey];
        const a = this.#parseToLatex(curVal[0]);
        const b = curVal[1] ? this.#parseToLatex(curVal[1]) : ' ';
        const c = curVal[2] ? this.#parseToLatex(curVal[2]) : ' ';
        switch (curKey) {
          case '18':
            result += `{${a}} \\dfrac {\\displaystyle ${b}} {\\displaystyle ${c}} `;
            break;
          case '2F':
            result += recDecToLatex(a, this.modelType, this.modelId);
            break;
          case '50':
            result += `\\sum_{x=${b}}^{${c}}{\\left(${a}\\right)} `;
            break;
          case '51':
            result += `\\int_{${b}}^{${c}}{${a}}\\mathrm{d}x `;
            break;
          case '52':
            result += `\\dfrac{\\mathrm{d}}{\\mathrm{d}x} {\\left(${a}\\right)} \\Bigg|_{x=${b}} `;
            break;
          case '53':
            result += `\\prod\\limits_{x=${b}}^{${c}}{\\left(${a}\\right)} `;
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
    try {
      const tree = this.#parseToTree();
      return this.#parseToLatex(tree);
    } catch (e) {
      console.error(e);
      return this.parseLine();
    }
  }

  autoParse({ M, S }) {
    const parseM = new ParseMode({ M })
    if (new ParseSetup({ S }).getInput() === '1' &&
      (['88', '89', '09', '0G', 'C1', 'C4'].includes(parseM.getMainMode())
        || ('45' === parseM.getMainMode() && '08' === parseM.getSubMode()))
    ) {
      return this.parseMath();
    }
    return this.parseLine();
  }
}
