import { ParseVariable } from "./index.js";
import { ParseMode } from "../mode/index.js";
import { ParseSetup } from "../setup/index.js";

export const ParseSpreadsheet = (T) => {
  const position = T.slice(2, 62).match(/[\dA-F]{12}/g).map(t => {
    return parseInt(t, 16).toString(2).padStart(48, '0').slice(0, 45);
  });
  const array = Array.from(Array(45), () => Array(5));
  let k = 0;
  for (let i = 0; i < position.length; i++) {
    for (let j = 0; j < position[i].length; j++) {
      const hasData = position[i][j] === '1';
      if (hasData) {
        const cell = T.slice(62 + 9 * k, 62 + 9 * (k + 1));
        if (cell.match(/^[0-9]+$/)) {
          const [, decimal] = new ParseVariable(`0${cell}`).get();
          array[j][i] = decimal;
        } else {
          array[j][i] = new ParseVariable(cell).get()[0];
        }
        k++;
      }
    }
  }
  const csv = array.map(row => row.join(',')).join('\n');
  return { array, csv };
}

const ParseCompressStatistic = (T) => {
  return T.match(/.{6}/g).map(t => {
    const data = t.match(/.{2}/g).map(tt => {
      return parseInt(tt, 32).toString(10).padStart(3, '0')
    }).join('')
    const [, decimal] = new ParseVariable(`0${data}`).get();
    return decimal;
  });
}

const ParseRawStatistic = (T) => {
  return T.match(/.{9}/g).map(t => {
    const [, decimal] = new ParseVariable(`0${t}`).get();
    return decimal;
  })
}

export const ParseStatistic = (T, M, S) => {
  const parseM = new ParseMode(M);
  const mainMode = parseM.getMainMode();
  const subMode = parseM.getSubMode();
  const head = [];
  let numList;
  if (mainMode === '03') {
    // Statistic Mode
    head.push('x');
    subMode !== '01' && head.push('y');
    const freqOn = new ParseSetup(S).getStatisticsFrequencyCode() === '1';
    freqOn && head.push('Freq');
    numList = ParseCompressStatistic(T);
  } else if (mainMode === '0C') {
    // Distribution Mode
    head.push('x');
    head.push('P');
    numList = ParseRawStatistic(T);
  } else if (mainMode === '4F') {
    // Math Box Mode
    head.push('Freq');
    numList = ParseCompressStatistic(T);
  }
  const array = [head];
  for (let i = 0; i < numList.length; i++) {
    if (i % head.length === 0) {
      array.push([]);
    }
    array[array.length - 1].push(numList[i]);
  }
  const csv = array.map(row => row.join(',')).join('\n');
  return { array, csv };
}
