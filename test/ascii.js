import { AsciiTable } from '../src/ascii/index.js';

let unicode, latex;

unicode = (new AsciiTable('EY', '001').get('unicode'))
latex = (new AsciiTable('EY', '001').get('latex'))
console.log(unicode, latex)

unicode = (new AsciiTable('EY', '031').get('unicode'))
latex = (new AsciiTable('EY', '031').get('latex'))
console.log(unicode, latex)

unicode = (new AsciiTable('CY', '239').get('unicode'))
latex = (new AsciiTable('CY', '239').get('latex'))
console.log(unicode, latex)

unicode = (new AsciiTable('CY', '243').get('unicode'))
latex = (new AsciiTable('CY', '243').get('latex'))
console.log(unicode, latex)
