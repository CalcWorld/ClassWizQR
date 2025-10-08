import { AsciiTable } from '../ascii/index.js';
import { toAsciiArray, tt } from '../utils.js';
import { ParseSetup } from '../setup/index.js';

export class ParseAlgorithm {
  /**
   * @param {string} S
   * @param {string} E
   * @param {string} modelType
   * @param {string} modelId
   */
  constructor(S, E, modelType, modelId) {
    this.unitSetiing = new ParseSetup(S || '').getAlgorithmUnitSettingCode() || '0'; // default to 0-pixels
    this.E = E;
    const asciiTable = new AsciiTable(modelType, modelId);
    this.asciiLatexTable = asciiTable.get('latex');
    this.asciiUnicodeTable = asciiTable.get('unicode');

    this.tree = void 0;

    this.algoCmd = [
      'F903',
      'F905',
      'F906',
      'F907',
      'F908',
      'F909',
      'F90A',
      'F90B',
      'F90C',
      'F90D',
      'F90E',
      'F90F',
      'F910',
      'F911',
      'F912',
      'F913',
      'F914',
      'F915',
      'F916',
      'F917',
      'F918',
      'F919',
    ];

    this.algoSep = [
      '00',
    ];

    this.algoEnd = [
      'F901',
      'F902',
    ];

    this.algoTabOpen = [
      'F911',
      'F913',
      'F915',
      'F917',
      'F918',
    ];

    this.algoTabClose = [
      'F912',
      'F914',
      'F916',
      'F918',
      'F919',
    ];

  }

  #parseToTree() {
    if (this.tree) return this.tree;
    const { E, algoCmd, algoSep, algoEnd } = this;
    const asciiArray = toAsciiArray(E);

    const result = [];
    let currentCmd;
    let currentArg = [];
    for (let i = 0; i < asciiArray.length; i++) {
      const cur = asciiArray[i];
      const next = i + 1 < asciiArray.length ? asciiArray[i + 1] : null;
      if (algoCmd.includes(cur)) {
        currentArg = [];
        currentCmd = { key: cur, value: currentArg };
        result.push(currentCmd);
        continue;
      }
      if (algoSep.includes(cur)) {
        if (!algoEnd.includes(next)) {
          currentArg.push([]);
        }
        continue;
      }
      if (algoEnd.includes(cur)) {
        continue;
      }
      if (currentArg.length === 0) {
        currentArg.push([]);
      }
      currentArg[currentArg.length - 1].push(cur);
    }

    this.tree = result;
    return result;
  }

  /**
   * @param {string} tab
   * @param {function(string, string[][], function(string, string[]): string[]): string} getAlgo
   * @return {string[]}
   */
  #parseToList(getAlgo, tab = '') {
    this.#parseToTree();
    const { tree, algoTabOpen, algoTabClose } = this;
    const result = [];
    let tabWidth = 0;
    for (const i of tree) {
      const key = i.key;
      if (tab && algoTabClose.includes(key)) tabWidth--;
      result.push(`${tab ? tab.repeat(tabWidth) : ''}${getAlgo(key, i.value, (key, value) => {
        switch (key) {
          case 'F905':
            value.push(tt(`setup.ALGORITHM_UNIT_SETTING.${this.unitSetiing}`));
            return value;
          case 'F90D':
          case 'F90F':
            return value.map(i => (tt(`algo.${key}-${i}`) || i));
        }
        return value;
      })}`);
      if (tab && algoTabOpen.includes(key)) tabWidth++;
    }
    return result;
  }

  /**
   * @return {string[]}
   */
  parseToLaTeX() {
    return this.#parseToList((key, values, valueFunc) => {
      const value = valueFunc(key, values.map(i => i.map(i => this.asciiLatexTable[i]).join(' ')));
      let algoCmd = tt(`algo.${key}`).replace(/ /g, '\\ ');
      for (const [i, v] of value.entries()) {
        algoCmd = algoCmd?.replace(`\$\{${i}\}`, v);
      }
      return algoCmd;
    }, '\\ \\ ');
  }

  /**
   * @return {string[]}
   */
  parseToText() {
    return this.#parseToList((key, values, valueFunc) => {
      const value = valueFunc(key, values.map(i => i.map(i => this.asciiUnicodeTable[i]).join('')));
      return tt(`algo.${key}`, ...value);
    }, '  ');
  }

  /**
   * @return {string[]}
   */
  parseToScratch() {
    return this.#parseToList((key, values, valueFunc) => {
      const value = valueFunc(key, values.map(i => i.map(i =>
        this.asciiUnicodeTable[i].replace(/[<>{}()\[\]\\]/g, m => `\\${m}`)
      ).join('')));
      switch (key) {
        case 'F90C':
          value.push(tt('algo.scratch.value'));
          break;
        case 'F90D':
        case 'F90E':
        case 'F910':
          value.push(tt('algo.scratch.any'));
          break;
      }
      return tt(`algo.scratch.${key}`, ...value);
    }, '  ');
  }

  parseAll() {
    return {
      latexCommand: this.parseToLaTeX(),
      textCommand: this.parseToText(),
      scratchBlocks: this.parseToScratch(),
    };
  }
}
