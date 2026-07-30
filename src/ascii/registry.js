import { ascii00, ascii00_DECIMAL_MARK_COMMA, ascii00_EY, ascii00_FR, ascii00_FR_EY, } from './00.js';
import { asciiFA } from './FA.js';
import { asciiFB, asciiFB_EY } from './FB.js';
import { asciiFD, asciiFD_EY, asciiFD_FR } from './FD.js';
import { asciiFE, asciiFE_FY, asciiFE_JP } from './FE.js';
import { MODEL_TYPE_EY_FY } from '../model/index.js';

const isEYOrFY = ({ modelType }) => MODEL_TYPE_EY_FY.includes(modelType);
const isFrench = ({ profile }) => profile.locale === 'fr';
const isJapanese = ({ profile }) => profile.locale === 'jp';
const usesDecimalComma = ({ profile }) => profile.decimalMark === 'comma';

export const ASCII_PAGE_DEFINITIONS = [
  {
    prefix: '',
    base: ascii00,
    patches: [
      { map: ascii00_DECIMAL_MARK_COMMA, when: usesDecimalComma },
      { map: ascii00_FR, when: isFrench },
      { map: ascii00_EY, when: isEYOrFY },
      {
        map: ascii00_FR_EY,
        when: context => isFrench(context) && isEYOrFY(context),
      },
    ],
  },
  {
    prefix: 'FA',
    base: asciiFA,
    convertUnicode: true,
  },
  {
    prefix: 'FB',
    base: asciiFB,
    convertUnicode: true,
    patches: [
      { map: asciiFB_EY, when: isEYOrFY, convertUnicode: true },
    ],
  },
  {
    prefix: 'FD',
    base: asciiFD,
    patches: [
      { map: asciiFD_FR, when: isFrench, convertUnicode: true },
      { map: asciiFD_EY, when: isEYOrFY },
    ],
  },
  {
    prefix: 'FE',
    base: asciiFE,
    convertUnicode: true,
    patches: [
      { map: asciiFE_JP, when: isJapanese, convertUnicode: true },
      { map: asciiFE_FY, when: isEYOrFY, convertUnicode: true },
    ],
  },
];
