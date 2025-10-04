import { AsciiTable } from '../ascii/index.js';
import { toAsciiArray, translate } from '../utils.js';
import algoCmdMap from './cmd.js';
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

  parseToTree() {
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
   *
   * @param {object} map
   * @param {object} asciiTable
   * @param {string} tab
   * @param {string} joinSeparator
   * @return {string[]}
   */
  #parseToList(map, asciiTable, tab = '', joinSeparator = '') {
    this.parseToTree();
    const { tree, algoTabOpen, algoTabClose } = this;
    const result = [];
    let tabWidth = 0;
    for (const i of tree) {
      const key = i.key;
      if (tab && algoTabClose.includes(key)) tabWidth--;
      const value = i.value.map(i => i.map(i => asciiTable[i]).join(joinSeparator));
      value.push(this.unitSetiing); // the last argument passes to map function is always the unit setting
      result.push(`${tab ? tab.repeat(tabWidth) : ''}${map[key](...value)}`);
      if (tab && algoTabOpen.includes(key)) tabWidth++;
    }
    return result;
  }

  /**
   * @return {string[]}
   */
  parseToLaTeXCmdList() {
    const latexMap = translate(algoCmdMap.latex);
    return this.#parseToList(latexMap, this.asciiLatexTable, '\\ \\ ', ' ');
  }

  parseToTextCmdList() {
    const latexMap = translate(algoCmdMap.latex);
    return this.#parseToList(latexMap, this.asciiUnicodeTable, '  ', '').map(i => i.replace(/\\ /g, ' '));
  }

  /**
   * @return {string[]}
   */
  parseToScratch() {
    const scratchMap = translate(algoCmdMap.scratch);
    return this.#parseToList(scratchMap, Object.fromEntries(
      Object.entries(this.asciiUnicodeTable).map(([key, value]) => [key, value.replace(/[<>{}()\[\]\\]/g, m => '\\' + m)])
    ));
  }

  parseAll() {
    return {
      latexCommand: this.parseToLaTeXCmdList(),
      textCommand: this.parseToTextCmdList(),
      scratchBlocks: this.parseToScratch(),
    };
  }
}
