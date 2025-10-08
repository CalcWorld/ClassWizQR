import { ParseMathBox } from '../src/variable/T.js';
import { parseUrl } from '../src/index.js';
import en from '../src/i18n-res/en.json' with { type: 'json' };
import zh from '../src/i18n-res/zh.json' with { type: 'json' };
import vi from '../src/i18n-res/vi.json' with { type: 'json' };
import fr from '../src/i18n-res/fr.json' with { type: 'json' };

console.log(ParseMathBox('000000000000000000340034000000000000000000340034340034340034000000000000340034000000000000000000', '4F00S10000', '030000000000000001000500000000000000010000000000000000000000'))
console.log(ParseMathBox('3400349C0034340034000000', '4F00S20000', '0300000000000000010005000000000000000100'))
console.log(ParseMathBox('6800349C0034', '4F00S20000', '0100000000000000010005000000000000000100'))
console.log(ParseMathBox('9C0034680034000000', '4F00S20000', '0200000000000000010005000000000000000100'))
console.log(ParseMathBox('000000340034CG0034000000', '4F00S20000', '0300000000000000010005000000000000000100'))

console.log(parseUrl('http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-4F00S20000+S-001410101000000E1010B0001911+C-0200000000000000010005000000000000000100+T-9C0034680034000000',
  'zh', { en, zh, vi, fr }));
