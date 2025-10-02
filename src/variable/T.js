import { ParseVariable } from "./index.js";
import { ParseMode } from "../mode/index.js";
import { ParseSetup } from "../setup/index.js";
import { ParseMathBoxParameter } from './C.js';
import Decimal from 'decimal.js';

export const ParseSpreadsheet = (T) => {
  const position = T.slice(2, 62).match(/[\dA-F]{12}/g).map(t => {
    return parseInt(t, 16).toString(2).padStart(48, '0').slice(0, 45);
  });
  const array = Array.from(Array(45), () => Array(5).fill(undefined));
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

const generateArray = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => new Decimal(a).plus(i));

export const ParseMathBoxResult = (T, M, C) => {
  const mathBoxParameter = ParseMathBoxParameter(M, C);
  const { subMode, freqResultTypeName, quantity, freqResultType } = mathBoxParameter;
  const head = [freqResultTypeName, 'Freq', 'Rel Fr'];
  let typeList;
  const freqList = ParseCompressStatistic(T);

  switch (subMode) {
    case 'S1':
      if (quantity.eq(1)) {
        typeList = generateArray(1, 6);
      } else if (quantity.eq(2)) {
        if (freqResultType.eq(0)) {
          typeList = generateArray(2, 12);
        } else {
          typeList = generateArray(0, 5);
        }
      } else if (quantity.eq(3)) {
        typeList = generateArray(3, 18);
      }
      break;
    case 'S2':
      if (quantity.eq(1)) {
        freqList.reverse();
        typeList = generateArray(0, 1);
      } else if (quantity.eq(2)) {
        typeList = generateArray(0, 2);
      } else if (quantity.eq(3)) {
        typeList = generateArray(0, 3);
      }
      break;
    default:
      throw new Error('Unsupported MathBox');
  }

  if (typeList.length !== freqList.length) {
    throw new Error('Parse Error MathBox');
  }

  const numSum = freqList.reduce((acc, curr) => acc.plus(curr));
  const relFrList = freqList.map(i => i.div(numSum));

  const array = [head];
  for (let i = 0; i < freqList.length; i++) {
    array.push([typeList[i], freqList[i], relFrList[i]]);
  }

  const csv = array.map(row => row.join(',')).join('\n');
  return { array, csv };
}
