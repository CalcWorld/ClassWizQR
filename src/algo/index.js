import { AsciiTable } from '../ascii/index.js';
import { toAsciiArray } from '../utils.js';
import algoCmdMap from './cmd.js';

export class ParseAlgorithm {
  constructor(E, modelType, modelId) {
    this.E = E;
    this.asciiTable = new AsciiTable(modelType, modelId).get();

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

  }

  parseToTree() {
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
        currentCmd = { [cur]: currentArg };
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

  parseToCmd() {
    this.parseToTree();
    const { asciiTable, tree } = this;
    let result = '';
    for (const i of tree) {
      const cmd = Object.entries(i)[0];
      const key = cmd[0];
      const value = cmd[1].map(i => i.map(i => asciiTable[i]).join(''));
      result += algoCmdMap[key](...value) + '\n'
    }

    return result;
  }
}
