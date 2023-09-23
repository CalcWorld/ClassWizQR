import Decimal from "decimal.js";
import { ParseVariable } from "./index.js";

export const ParseSpreadsheet = (spreadsheet) => {
  const position = spreadsheet.slice(2, 62).match(/[\dA-F]{12}/g).map(t => {
    return parseInt(t, 16).toString(2).padStart(48, '0').slice(0, 45);
  });
  const array = Array.from(Array(45), () => Array(5).fill(new Decimal(0)));
  let k = 0;
  for (let i = 0; i < position.length; i++) {
    for (let j = 0; j < position[i].length; j++) {
      const hasData = position[i][j] === '1';
      if (hasData) {
        const cell = spreadsheet.slice(62 + 9 * k, 62 + 9 * (k + 1));
        if (cell.match(/^[0-9]+$/)) {
          array[j][i] = new ParseVariable(`0${cell}`).get();
        } else {
          // TODO: parse ERROR
          array[j][i] = 'ERROR';
        }
        k++;
      }
    }
  }
  const csv = array.map(row => row.join(',')).join('\n');
  return { array, csv };
}

export const ParseStatistic = (stat) => {
  // TODO: parse column
  return stat.match(/.{6}/g).map(t => {
    const data = t.match(/.{2}/g).map(tt => {
      return parseInt(tt, 32).toString(10).padStart(3, '0')
    }).join('')
    const [latex, decimal] = new ParseVariable(`0${data}`).get();
    return decimal;
  });
}
