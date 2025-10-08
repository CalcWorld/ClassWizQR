import algoCmd from '../src/algo/cmd.js'
import { loadResource, tt } from '../src/utils.js';
import { AsciiTable } from '../src/ascii/index.js';


const args = Array.from({ length: 4 }).map((_, i) => `\$\{${i}\}`);
console.log(args);
const i18nRes = {}

for (const [locale, latex] of Object.entries(algoCmd.latex)) {
  for (const [key, val] of Object.entries(latex)) {
    const valText = val(...args).replace(/\\ /g, ' ');
    console.log(`algo.${key}`, valText);
    i18nRes[locale] || (i18nRes[locale] = {});
    i18nRes[locale].algo || (i18nRes[locale].algo = {});
    i18nRes[locale].algo[key] = valText;
  }
}

console.log(JSON.stringify(i18nRes, null, 2));

loadResource('en', i18nRes.en);

const asciiTable = new AsciiTable('EY', '005').get('unicode')
const params = [['31', '31', '34'], ['35', '31', '34']]
  .map(i => i.map(i => asciiTable[i]).join(''))


console.log(tt('algo.F908', ...params));

