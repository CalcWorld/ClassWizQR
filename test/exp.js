import { ParseExpression } from '../src/expression/index.js';
import util from 'util';

util.inspect.defaultOptions.depth = null;

let E = 'C81D1A741A381B1B1A351B1E'
const parseE = new ParseExpression(E, 'EY', '007');
parseE.parseMath();
console.log(parseE.tree);
