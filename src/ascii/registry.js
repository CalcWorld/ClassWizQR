import { ascii00, ascii00_DECIMAL_MARK_COMMA, ascii00_EY, ascii00_FR, ascii00_FR_EY, } from './00.js';
import { asciiFA } from './FA.js';
import { asciiFB, asciiFB_EY } from './FB.js';
import { asciiFD, asciiFD_EY, asciiFD_FR } from './FD.js';
import { asciiFE, asciiFE_FY, asciiFE_JP } from './FE.js';
import { MODEL_TYPE_EY_FY } from '../model/index.js';

const isEYOrFY = ({ modelType }) => MODEL_TYPE_EY_FY.includes(modelType);
const isFR = ({ profile }) => profile.locale === 'fr';
const isJP = ({ profile }) => profile.locale === 'jp';
const usesDecimalComma = ({ profile }) => profile.decimalMark === 'comma';

export const ASCII_PAGE_DEFINITIONS = [
  {
    prefix: '',
    base: ascii00,
    patches: [
      {
        when: usesDecimalComma,
        map: ascii00_DECIMAL_MARK_COMMA,
      },
      {
        when: isFR,
        map: ascii00_FR,
      },
      {
        when: isEYOrFY,
        map: ascii00_EY,
      },
      {
        when: context => isFR(context) && isEYOrFY(context),
        map: ascii00_FR_EY,
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
      {
        when: isEYOrFY,
        convertUnicode: true,
        map: asciiFB_EY,
      },
    ],
  },
  {
    prefix: 'FD',
    base: asciiFD,
    patches: [
      {
        when: isFR,
        convertUnicode: true,
        map: asciiFD_FR,
      },
      {
        when: isEYOrFY,
        map: asciiFD_EY,
      },
    ],
  },
  {
    prefix: 'FE',
    base: asciiFE,
    convertUnicode: true,
    patches: [
      {
        when: isJP,
        convertUnicode: true,
        map: asciiFE_JP,
      },
      {
        when: isEYOrFY,
        convertUnicode: true,
        map: asciiFE_FY,
      },
    ],
  },
];
