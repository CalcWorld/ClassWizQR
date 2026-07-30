import assert from 'node:assert/strict';
import { test } from 'vitest';

import { parse, projectLocalization, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Calculate-Mode.md
const cases = [
  {
    "name": "Calculate sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-C10000AD00+S-001410101000000E1010B0002338+Q-09000000000000000007552801000000000000000000000000000000+E-7A7B7C79787739",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "FY",
        "id": "505",
        "name": "fx-9910CW 2nd edition",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Calculate",
        "mainMode": "C1",
        "subMode": "00"
      },
      "format": {
        "displayName": "Decimal",
        "storeName": "Standard",
        "displayCode": "A",
        "storeCode": "D"
      },
      "setup": [
        {
          "type": "NUMBER_FORMAT",
          "code": "00"
        },
        {
          "type": "INPUT_OUTPUT",
          "code": "10"
        },
        {
          "type": "DECIMAL_MARK",
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "4"
        },
        {
          "type": "FRACTION_RESULT",
          "code": "0"
        },
        {
          "type": "COMPLEX_RESULT",
          "code": "1"
        },
        {
          "type": "STATISTICS_FREQUENCY",
          "code": "0"
        },
        {
          "type": "RECURRING_DECIMAL",
          "code": "1"
        },
        {
          "type": "SIMPLIFY",
          "code": "0"
        },
        {
          "type": "AUTO_POWER_OFF",
          "code": "0"
        },
        {
          "type": "TABLE_TYPE",
          "code": "0"
        },
        {
          "type": "ENGINEER_SYMBOL",
          "code": "0"
        },
        {
          "type": "DIGIT_SEPARATOR",
          "code": "0"
        },
        {
          "type": "MULTI_LINE_FONT",
          "code": "E"
        },
        {
          "type": "EQUATION_COMPLEX_ROOT",
          "code": "1"
        },
        {
          "type": "LANGUAGE",
          "code": "0"
        },
        {
          "type": "SPREADSHEET_AUTO_CALC",
          "code": "1"
        },
        {
          "type": "SPREADSHEET_SHOW_CELL",
          "code": "0"
        },
        {
          "type": "QR_CODE_VERSION",
          "code": "B"
        },
        {
          "type": "ALGORITHM_BACKGROUND",
          "code": "0"
        },
        {
          "type": "ALGORITHM_UNIT_SETTING",
          "code": "0"
        }
      ],
      "semanticFields": [
        "expression",
        "result"
      ],
      "expression": "\\sin^{-1}( \\cos^{-1}( \\tan^{-1}( \\tan( \\cos( \\sin( 9",
      "result": [
        {
          "name": "templated",
          "latex": "9.0000000000000000075528"
        },
        {
          "name": "Part1",
          "latex": "9.0000000000000000075528",
          "decimal": "9.0000000000000000075528"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ]
    }
  },
  {
    "name": "Calculate sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-C10012AD47+S-001410101000000E1010B0003495+Q-80000001000201010000000000010450000000000000000000000101+E-7E312C31",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "FY",
        "id": "505",
        "name": "fx-9910CW 2nd edition",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Calculate",
        "mainMode": "C1",
        "subMode": "00"
      },
      "format": {
        "displayName": "Decimal",
        "storeName": "Standard",
        "displayCode": "A",
        "storeCode": "D"
      },
      "setup": [
        {
          "type": "NUMBER_FORMAT",
          "code": "00"
        },
        {
          "type": "INPUT_OUTPUT",
          "code": "10"
        },
        {
          "type": "DECIMAL_MARK",
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "4"
        },
        {
          "type": "FRACTION_RESULT",
          "code": "0"
        },
        {
          "type": "COMPLEX_RESULT",
          "code": "1"
        },
        {
          "type": "STATISTICS_FREQUENCY",
          "code": "0"
        },
        {
          "type": "RECURRING_DECIMAL",
          "code": "1"
        },
        {
          "type": "SIMPLIFY",
          "code": "0"
        },
        {
          "type": "AUTO_POWER_OFF",
          "code": "0"
        },
        {
          "type": "TABLE_TYPE",
          "code": "0"
        },
        {
          "type": "ENGINEER_SYMBOL",
          "code": "0"
        },
        {
          "type": "DIGIT_SEPARATOR",
          "code": "0"
        },
        {
          "type": "MULTI_LINE_FONT",
          "code": "E"
        },
        {
          "type": "EQUATION_COMPLEX_ROOT",
          "code": "1"
        },
        {
          "type": "LANGUAGE",
          "code": "0"
        },
        {
          "type": "SPREADSHEET_AUTO_CALC",
          "code": "1"
        },
        {
          "type": "SPREADSHEET_SHOW_CELL",
          "code": "0"
        },
        {
          "type": "QR_CODE_VERSION",
          "code": "B"
        },
        {
          "type": "ALGORITHM_BACKGROUND",
          "code": "0"
        },
        {
          "type": "ALGORITHM_UNIT_SETTING",
          "code": "0"
        }
      ],
      "semanticFields": [
        "expression",
        "result"
      ],
      "expression": "\\mathrm{Pol}( 1 , 1",
      "result": [
        {
          "name": "templated",
          "latex": "r= \\sqrt{2} ,θ=45"
        },
        {
          "name": "Part1",
          "latex": " \\sqrt{2} ",
          "decimal": "1.4142135623730950488"
        },
        {
          "name": "Part2",
          "latex": "45",
          "decimal": "45"
        }
      ]
    }
  },
  {
    "name": "Calculate sample 3",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-C10000DD00+S-001410101000000E1010B0001742+Q-80010503000501060000000001010000000000000000000000000000+E-181F1D1A311B1A321B1A331B1EA6C81D1A741A351B1B1A361B1E",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "FY",
        "id": "505",
        "name": "fx-9910CW 2nd edition",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Calculate",
        "mainMode": "C1",
        "subMode": "00"
      },
      "format": {
        "displayName": "Standard",
        "storeName": "Standard",
        "displayCode": "D",
        "storeCode": "D"
      },
      "setup": [
        {
          "type": "NUMBER_FORMAT",
          "code": "00"
        },
        {
          "type": "INPUT_OUTPUT",
          "code": "10"
        },
        {
          "type": "DECIMAL_MARK",
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "4"
        },
        {
          "type": "FRACTION_RESULT",
          "code": "0"
        },
        {
          "type": "COMPLEX_RESULT",
          "code": "1"
        },
        {
          "type": "STATISTICS_FREQUENCY",
          "code": "0"
        },
        {
          "type": "RECURRING_DECIMAL",
          "code": "1"
        },
        {
          "type": "SIMPLIFY",
          "code": "0"
        },
        {
          "type": "AUTO_POWER_OFF",
          "code": "0"
        },
        {
          "type": "TABLE_TYPE",
          "code": "0"
        },
        {
          "type": "ENGINEER_SYMBOL",
          "code": "0"
        },
        {
          "type": "DIGIT_SEPARATOR",
          "code": "0"
        },
        {
          "type": "MULTI_LINE_FONT",
          "code": "E"
        },
        {
          "type": "EQUATION_COMPLEX_ROOT",
          "code": "1"
        },
        {
          "type": "LANGUAGE",
          "code": "0"
        },
        {
          "type": "SPREADSHEET_AUTO_CALC",
          "code": "1"
        },
        {
          "type": "SPREADSHEET_SHOW_CELL",
          "code": "0"
        },
        {
          "type": "QR_CODE_VERSION",
          "code": "B"
        },
        {
          "type": "ALGORITHM_BACKGROUND",
          "code": "0"
        },
        {
          "type": "ALGORITHM_UNIT_SETTING",
          "code": "0"
        }
      ],
      "semanticFields": [
        "expression",
        "result"
      ],
      "expression": "{1} \\dfrac {\\displaystyle 2} {\\displaystyle 3}  + \\dfrac{\\displaystyle \\sqrt{5} } {\\displaystyle 6} ",
      "result": [
        {
          "name": "templated",
          "latex": " \\dfrac { \\displaystyle  10  +  \\sqrt{5}  } {\\displaystyle 6}"
        },
        {
          "name": "Part1",
          "latex": " \\dfrac { \\displaystyle  10  +  \\sqrt{5}  } {\\displaystyle 6}",
          "decimal": "2.0393446629166316161"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ]
    }
  },
  {
    "name": "Calculate sample 4",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-C10000AD00+S-001410101000000E1010B0002338+Q-01300000000000000000000001010000000000000000000000000000+E-521A47C91A321BA633471C351B",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "FY",
        "id": "505",
        "name": "fx-9910CW 2nd edition",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Calculate",
        "mainMode": "C1",
        "subMode": "00"
      },
      "format": {
        "displayName": "Decimal",
        "storeName": "Standard",
        "displayCode": "A",
        "storeCode": "D"
      },
      "setup": [
        {
          "type": "NUMBER_FORMAT",
          "code": "00"
        },
        {
          "type": "INPUT_OUTPUT",
          "code": "10"
        },
        {
          "type": "DECIMAL_MARK",
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "4"
        },
        {
          "type": "FRACTION_RESULT",
          "code": "0"
        },
        {
          "type": "COMPLEX_RESULT",
          "code": "1"
        },
        {
          "type": "STATISTICS_FREQUENCY",
          "code": "0"
        },
        {
          "type": "RECURRING_DECIMAL",
          "code": "1"
        },
        {
          "type": "SIMPLIFY",
          "code": "0"
        },
        {
          "type": "AUTO_POWER_OFF",
          "code": "0"
        },
        {
          "type": "TABLE_TYPE",
          "code": "0"
        },
        {
          "type": "ENGINEER_SYMBOL",
          "code": "0"
        },
        {
          "type": "DIGIT_SEPARATOR",
          "code": "0"
        },
        {
          "type": "MULTI_LINE_FONT",
          "code": "E"
        },
        {
          "type": "EQUATION_COMPLEX_ROOT",
          "code": "1"
        },
        {
          "type": "LANGUAGE",
          "code": "0"
        },
        {
          "type": "SPREADSHEET_AUTO_CALC",
          "code": "1"
        },
        {
          "type": "SPREADSHEET_SHOW_CELL",
          "code": "0"
        },
        {
          "type": "QR_CODE_VERSION",
          "code": "B"
        },
        {
          "type": "ALGORITHM_BACKGROUND",
          "code": "0"
        },
        {
          "type": "ALGORITHM_UNIT_SETTING",
          "code": "0"
        }
      ],
      "semanticFields": [
        "expression",
        "result"
      ],
      "expression": "\\dfrac{\\mathrm{d}}{\\mathrm{d}x} {\\left(x ^{2}  + 3 x\\right)} \\Bigg|_{x=5} ",
      "result": [
        {
          "name": "templated",
          "latex": "13"
        },
        {
          "name": "Part1",
          "latex": "13",
          "decimal": "13"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ]
    }
  },
  {
    "name": "Calculate sample 5",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-C10000AD00+S-001510101000000E1010B000270F+Q-06931471805599453094326900990000000000000000000000000000+E-511AC81D1A7747D01B1A7847D01B1E1C301CC81D1A221B1A331B1E1B",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "FY",
        "id": "505",
        "name": "fx-9910CW 2nd edition",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Calculate",
        "mainMode": "C1",
        "subMode": "00"
      },
      "format": {
        "displayName": "Decimal",
        "storeName": "Standard",
        "displayCode": "A",
        "storeCode": "D"
      },
      "setup": [
        {
          "type": "NUMBER_FORMAT",
          "code": "00"
        },
        {
          "type": "INPUT_OUTPUT",
          "code": "10"
        },
        {
          "type": "DECIMAL_MARK",
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "5"
        },
        {
          "type": "FRACTION_RESULT",
          "code": "0"
        },
        {
          "type": "COMPLEX_RESULT",
          "code": "1"
        },
        {
          "type": "STATISTICS_FREQUENCY",
          "code": "0"
        },
        {
          "type": "RECURRING_DECIMAL",
          "code": "1"
        },
        {
          "type": "SIMPLIFY",
          "code": "0"
        },
        {
          "type": "AUTO_POWER_OFF",
          "code": "0"
        },
        {
          "type": "TABLE_TYPE",
          "code": "0"
        },
        {
          "type": "ENGINEER_SYMBOL",
          "code": "0"
        },
        {
          "type": "DIGIT_SEPARATOR",
          "code": "0"
        },
        {
          "type": "MULTI_LINE_FONT",
          "code": "E"
        },
        {
          "type": "EQUATION_COMPLEX_ROOT",
          "code": "1"
        },
        {
          "type": "LANGUAGE",
          "code": "0"
        },
        {
          "type": "SPREADSHEET_AUTO_CALC",
          "code": "1"
        },
        {
          "type": "SPREADSHEET_SHOW_CELL",
          "code": "0"
        },
        {
          "type": "QR_CODE_VERSION",
          "code": "B"
        },
        {
          "type": "ALGORITHM_BACKGROUND",
          "code": "0"
        },
        {
          "type": "ALGORITHM_UNIT_SETTING",
          "code": "0"
        }
      ],
      "semanticFields": [
        "expression",
        "result"
      ],
      "expression": "\\int_{0}^{\\dfrac{\\displaystyle \\pi} {\\displaystyle 3} }{\\dfrac{\\displaystyle \\sin( x )} {\\displaystyle \\cos( x )} }\\mathrm{d}x ",
      "result": [
        {
          "name": "templated",
          "latex": "0.69314718055994530943269"
        },
        {
          "name": "Part1",
          "latex": "0.69314718055994530943269",
          "decimal": "0.69314718055994530943269"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ]
    }
  },
  {
    "name": "Calculate sample 6",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-C10000AD00+S-001510101000000E1010B000270F+Q-01374862881916893609125701010000000000000000000000000000+E-501A7D1A331C471B1C311C31301B",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "FY",
        "id": "505",
        "name": "fx-9910CW 2nd edition",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Calculate",
        "mainMode": "C1",
        "subMode": "00"
      },
      "format": {
        "displayName": "Decimal",
        "storeName": "Standard",
        "displayCode": "A",
        "storeCode": "D"
      },
      "setup": [
        {
          "type": "NUMBER_FORMAT",
          "code": "00"
        },
        {
          "type": "INPUT_OUTPUT",
          "code": "10"
        },
        {
          "type": "DECIMAL_MARK",
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "5"
        },
        {
          "type": "FRACTION_RESULT",
          "code": "0"
        },
        {
          "type": "COMPLEX_RESULT",
          "code": "1"
        },
        {
          "type": "STATISTICS_FREQUENCY",
          "code": "0"
        },
        {
          "type": "RECURRING_DECIMAL",
          "code": "1"
        },
        {
          "type": "SIMPLIFY",
          "code": "0"
        },
        {
          "type": "AUTO_POWER_OFF",
          "code": "0"
        },
        {
          "type": "TABLE_TYPE",
          "code": "0"
        },
        {
          "type": "ENGINEER_SYMBOL",
          "code": "0"
        },
        {
          "type": "DIGIT_SEPARATOR",
          "code": "0"
        },
        {
          "type": "MULTI_LINE_FONT",
          "code": "E"
        },
        {
          "type": "EQUATION_COMPLEX_ROOT",
          "code": "1"
        },
        {
          "type": "LANGUAGE",
          "code": "0"
        },
        {
          "type": "SPREADSHEET_AUTO_CALC",
          "code": "1"
        },
        {
          "type": "SPREADSHEET_SHOW_CELL",
          "code": "0"
        },
        {
          "type": "QR_CODE_VERSION",
          "code": "B"
        },
        {
          "type": "ALGORITHM_BACKGROUND",
          "code": "0"
        },
        {
          "type": "ALGORITHM_UNIT_SETTING",
          "code": "0"
        }
      ],
      "semanticFields": [
        "expression",
        "result"
      ],
      "expression": "\\sum_{x=1}^{1 0}{\\left(\\log_{3}{(x)} \\right)} ",
      "result": [
        {
          "name": "templated",
          "latex": "13.748628819168936091257"
        },
        {
          "name": "Part1",
          "latex": "13.748628819168936091257",
          "decimal": "13.748628819168936091257"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ]
    }
  },
  {
    "name": "Calculate sample 7",
    "url": "http://wes.casio.com/ncal/index.php?q=I-031A+U-000000000000+M-C10000BD00+S-001410100000000E1110B000E345+Q-21A70000000000000000000001030000000000000000000000000000+E-302E2F1A3134323835371B",
    "expected": {
      "model": {
        "type": "ClassWiz CW",
        "prefix": "EY",
        "id": "031",
        "name": "fx-JP900CW",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Calculate",
        "mainMode": "C1",
        "subMode": "00"
      },
      "format": {
        "displayName": "Improper Fraction",
        "storeName": "Standard",
        "displayCode": "B",
        "storeCode": "D"
      },
      "setup": [
        {
          "type": "NUMBER_FORMAT",
          "code": "00"
        },
        {
          "type": "INPUT_OUTPUT",
          "code": "10"
        },
        {
          "type": "DECIMAL_MARK",
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "4"
        },
        {
          "type": "FRACTION_RESULT",
          "code": "0"
        },
        {
          "type": "COMPLEX_RESULT",
          "code": "1"
        },
        {
          "type": "STATISTICS_FREQUENCY",
          "code": "0"
        },
        {
          "type": "RECURRING_DECIMAL",
          "code": "0"
        },
        {
          "type": "SIMPLIFY",
          "code": "0"
        },
        {
          "type": "AUTO_POWER_OFF",
          "code": "0"
        },
        {
          "type": "TABLE_TYPE",
          "code": "0"
        },
        {
          "type": "ENGINEER_SYMBOL",
          "code": "0"
        },
        {
          "type": "DIGIT_SEPARATOR",
          "code": "0"
        },
        {
          "type": "MULTI_LINE_FONT",
          "code": "E"
        },
        {
          "type": "EQUATION_COMPLEX_ROOT",
          "code": "1"
        },
        {
          "type": "LANGUAGE",
          "code": "1"
        },
        {
          "type": "SPREADSHEET_AUTO_CALC",
          "code": "1"
        },
        {
          "type": "SPREADSHEET_SHOW_CELL",
          "code": "0"
        },
        {
          "type": "QR_CODE_VERSION",
          "code": "B"
        },
        {
          "type": "ALGORITHM_BACKGROUND",
          "code": "0"
        },
        {
          "type": "ALGORITHM_UNIT_SETTING",
          "code": "0"
        }
      ],
      "semanticFields": [
        "expression",
        "result"
      ],
      "expression": "0 . \\dot{1}4285\\dot{7} ",
      "result": [
        {
          "name": "templated",
          "latex": " \\dfrac {\\displaystyle 1} {\\displaystyle 7}"
        },
        {
          "name": "Part1",
          "latex": " \\dfrac {\\displaystyle 1} {\\displaystyle 7}",
          "decimal": "0.14285714285714285714"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ]
    }
  },
  {
    "name": "Calculate sample 8",
    "url": "http://wes.casio.com/ncal/index.php?q=I-008A+U-000000000000+M-C10000BD00+S-401410100000000E0000B000E3B3+Q-21A70000000000000000000001030000000000000000000000000000+E-302E2F1A3134323835371B",
    "expected": {
      "model": {
        "type": "ClassWiz CW",
        "prefix": "EY",
        "id": "008",
        "name": "fx-82SP CW",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Calculate",
        "mainMode": "C1",
        "subMode": "00"
      },
      "format": {
        "displayName": "Improper Fraction",
        "storeName": "Standard",
        "displayCode": "B",
        "storeCode": "D"
      },
      "setup": [
        {
          "type": "NUMBER_FORMAT",
          "code": "40"
        },
        {
          "type": "INPUT_OUTPUT",
          "code": "10"
        },
        {
          "type": "DECIMAL_MARK",
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "4"
        },
        {
          "type": "FRACTION_RESULT",
          "code": "0"
        },
        {
          "type": "COMPLEX_RESULT",
          "code": "1"
        },
        {
          "type": "STATISTICS_FREQUENCY",
          "code": "0"
        },
        {
          "type": "RECURRING_DECIMAL",
          "code": "0"
        },
        {
          "type": "SIMPLIFY",
          "code": "0"
        },
        {
          "type": "AUTO_POWER_OFF",
          "code": "0"
        },
        {
          "type": "TABLE_TYPE",
          "code": "0"
        },
        {
          "type": "ENGINEER_SYMBOL",
          "code": "0"
        },
        {
          "type": "DIGIT_SEPARATOR",
          "code": "0"
        },
        {
          "type": "MULTI_LINE_FONT",
          "code": "E"
        },
        {
          "type": "EQUATION_COMPLEX_ROOT",
          "code": "0"
        },
        {
          "type": "LANGUAGE",
          "code": "0"
        },
        {
          "type": "SPREADSHEET_AUTO_CALC",
          "code": "0"
        },
        {
          "type": "SPREADSHEET_SHOW_CELL",
          "code": "0"
        },
        {
          "type": "QR_CODE_VERSION",
          "code": "B"
        },
        {
          "type": "ALGORITHM_BACKGROUND",
          "code": "0"
        },
        {
          "type": "ALGORITHM_UNIT_SETTING",
          "code": "0"
        }
      ],
      "semanticFields": [
        "expression",
        "result"
      ],
      "expression": "0 . \\overline{1 4 2 8 5 7} ",
      "result": [
        {
          "name": "templated",
          "latex": " \\dfrac {\\displaystyle 1} {\\displaystyle 7}"
        },
        {
          "name": "Part1",
          "latex": " \\dfrac {\\displaystyle 1} {\\displaystyle 7}",
          "decimal": "0.14285714285714285714"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ]
    }
  },
  {
    "name": "Calculate sample 9",
    "url": "http://wes.casio.com/ncal/index.php?q=I-023B+U-000000000000+M-C10000BD00+S-001410100000000E1010B000C50F+Q-21A70000000000000000000001030000000000000000000000000000+E-302E2F1A3134323835371B",
    "expected": {
      "model": {
        "type": "ClassWiz CW",
        "prefix": "EY",
        "id": "023",
        "name": "fx-880BTG",
        "version": "B",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Calculate",
        "mainMode": "C1",
        "subMode": "00"
      },
      "format": {
        "displayName": "Improper Fraction",
        "storeName": "Standard",
        "displayCode": "B",
        "storeCode": "D"
      },
      "setup": [
        {
          "type": "NUMBER_FORMAT",
          "code": "00"
        },
        {
          "type": "INPUT_OUTPUT",
          "code": "10"
        },
        {
          "type": "DECIMAL_MARK",
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "4"
        },
        {
          "type": "FRACTION_RESULT",
          "code": "0"
        },
        {
          "type": "COMPLEX_RESULT",
          "code": "1"
        },
        {
          "type": "STATISTICS_FREQUENCY",
          "code": "0"
        },
        {
          "type": "RECURRING_DECIMAL",
          "code": "0"
        },
        {
          "type": "SIMPLIFY",
          "code": "0"
        },
        {
          "type": "AUTO_POWER_OFF",
          "code": "0"
        },
        {
          "type": "TABLE_TYPE",
          "code": "0"
        },
        {
          "type": "ENGINEER_SYMBOL",
          "code": "0"
        },
        {
          "type": "DIGIT_SEPARATOR",
          "code": "0"
        },
        {
          "type": "MULTI_LINE_FONT",
          "code": "E"
        },
        {
          "type": "EQUATION_COMPLEX_ROOT",
          "code": "1"
        },
        {
          "type": "LANGUAGE",
          "code": "0"
        },
        {
          "type": "SPREADSHEET_AUTO_CALC",
          "code": "1"
        },
        {
          "type": "SPREADSHEET_SHOW_CELL",
          "code": "0"
        },
        {
          "type": "QR_CODE_VERSION",
          "code": "B"
        },
        {
          "type": "ALGORITHM_BACKGROUND",
          "code": "0"
        },
        {
          "type": "ALGORITHM_UNIT_SETTING",
          "code": "0"
        }
      ],
      "semanticFields": [
        "expression",
        "result"
      ],
      "expression": "0 . \\left( 1 4 2 8 5 7 \\right) ",
      "result": [
        {
          "name": "templated",
          "latex": " \\dfrac {\\displaystyle 1} {\\displaystyle 7}"
        },
        {
          "name": "Part1",
          "latex": " \\dfrac {\\displaystyle 1} {\\displaystyle 7}",
          "decimal": "0.14285714285714285714"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ]
    }
  }
];

for (const { name, url, expected } of cases) {
  test(name, () => {
    assert.deepEqual(projectResult(parse(url)), expected);
  });
}

const asciiExpressionCases = [
  {
    name: 'Calculate French CY ASCII expression',
    url: 'http://wes.casio.com/math/index.php?q=I-295A+U-000000000000+M-C10000AD00+S-000410110000100E0010B0006D13+R-0670000000000000010100000000000000000000+E-41A64AA68331D0A68432D0A688332C36D0A689352C3535D0A68A322E332C30D0A639AA32A642434445464740',
    expression: '\\mathrm{Rép} + \\mathrm{Pré\\text{-}Rép} + \\mathrm{Ent}( 1 ) + \\mathrm{EntEx}( 2 ) + \\mathrm{PGCD}( 3 ; 6 ) + \\mathrm{PPCM}( 5 ; 5 5 ) + \\mathrm{Arond}( 2 , 3 ; 0 ) + 9 ├ 2 + \\mathrm{A} \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} \\mathrm{M}',
  },
  {
    name: 'Calculate decimal-comma CY ASCII expression',
    url: 'http://wes.casio.com/math/index.php?q=I-247A+U-000000000000+M-C10000AD00+S-000410110000100E0000B000D695+R-0134000000000000010200000000000000000000+E-41A64AA68331D0A68432D0A688332C36D0A689352C3535D0A68A322E332C30D0A639AA32A642434445464740',
    expression: '\\mathrm{Ans} + \\mathrm{PreAns} + \\mathrm{Int}( 1 ) + \\mathrm{Intg}( 2 ) + \\mathrm{GCD}( 3 ; 6 ) + \\mathrm{LCM}( 5 ; 5 5 ) + \\mathrm{RndFix}( 2 , 3 ; 0 ) + 9 \\div \\mathrm{R} 2 + \\mathrm{A} \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} \\mathrm{M}',
  },
  {
    name: 'Calculate Japanese CY ASCII expression',
    url: 'http://wes.casio.com/math/index.php?q=I-243F+U-000000000000+M-C10000AD00+S-001410100000100E1110B0005EC6+R-0670000000000000010100000000000000000000+E-41A64AA68331D0A68432D0A688332C36D0A689352C3535D0A68A322E332C30D0A639AA32A642434445464740',
    expression: '\\mathrm{Ans} + \\mathrm{PreAns} + \\mathrm{Int}( 1 ) + \\mathrm{Intg}( 2 ) + \\mathrm{GCD}( 3 , 6 ) + \\mathrm{LCM}( 5 , 5 5 ) + \\mathrm{RndFix}( 2 . 3 , 0 ) + 9 \\div \\mathrm{R} 2 + \\mathrm{A} \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} \\mathrm{M}',
  },
  {
    name: 'Calculate decimal-comma EY ASCII expression',
    url: 'http://wes.casio.com/ncal/index.php?q=I-007A+U-000000000000+M-C10000AD00+S-000410110000000E0010B0007D91+Q-06700000000000000000000001010000000000000000000000000000+E-41A64AA68331D0A68432D0A688332C36D0A689352C3535D0A68A322E332C30D0A639AA32A642434445464740',
    expression: '\\mathrm{A} + \\mathrm{PreAns} + \\mathrm{Int}( 1 ) + \\mathrm{Intg}( 2 ) + \\mathrm{GCD}( 3 ; 6 ) + \\mathrm{LCM}( 5 ; 5 5 ) + \\mathrm{RndFix}( 2 , 3 ; 0 ) + 9 \\div \\mathrm{R} 2 + \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} x \\mathrm{Ans}',
  },
  {
    name: 'Calculate French FY ASCII expression',
    url: 'http://wes.casio.com/ncal/index.php?q=I-506A+U-000000000000+M-C10000AD00+S-400410111000000E0010B0007135+Q-06700000000000000000000001010000000000000000000000000000+E-41A64AA68331D0A68432D0A688332C36D0A689352C3535D0A68A322E332C30D0A639AA32A642434445464740',
    expression: '\\mathrm{A} + \\mathrm{PreAns} + \\mathrm{Ent}( 1 ) + \\mathrm{EntEx}( 2 ) + \\mathrm{PGCD}( 3 ; 6 ) + \\mathrm{PPCM}( 5 ; 5 5 ) + \\mathrm{Arond}( 2 , 3 ; 0 ) + 9 ├ 2 + \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} x \\mathrm{Rép}',
  },
  {
    name: 'Calculate Japanese EY ASCII expression',
    url: 'http://wes.casio.com/ncal/index.php?q=I-031A+U-000000000000+M-C10000AD00+S-001410100000000E1110B0007EB0+Q-06700000000000000000000001010000000000000000000000000000+E-41A64AA68331D0A68432D0A688332C36D0A689352C3535D0A68A322E332C30D0A639AA32A642434445464740',
    expression: '\\mathrm{A} + \\mathrm{PreAns} + \\mathrm{Int}( 1 ) + \\mathrm{Intg}( 2 ) + \\mathrm{GCD}( 3 , 6 ) + \\mathrm{LCM}( 5 , 5 5 ) + \\mathrm{RndFix}( 2 . 3 , 0 ) + 9 \\div \\mathrm{R} 2 + \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} x \\mathrm{Ans}',
  },
  {
    name: 'Calculate Spanish CY integer ASCII expression',
    url: 'http://wes.casio.com/math/index.php?q=I-268F+U-000000000000+M-C10014AD00+S-401410101000100E1010B000B181+R-0300000000000000010009000000000000000100+E-3939AA603688352C3689352C36',
    expression: '9 9 ∟ ( 6 \\mathrm{MCD}( 5 , 6 \\mathrm{MCM}( 5 , 6',
  },
  {
    name: 'Calculate Spanish CY trigonometric ASCII expression',
    url: 'http://wes.casio.com/math/index.php?q=I-268F+U-000000000000+M-C10000AD00+S-401410101000100E1010B000A93C+R-0900000000733338010000000000000000000000+E-7A7B7C79787739',
    expression: '\\mathrm{Arcsen}( \\mathrm{Arccos}( \\mathrm{Arctan}( \\tan( \\cos( \\mathrm{sen}( 9',
  },
  {
    name: 'Calculate Spanish CY hyperbolic ASCII expression',
    url: 'http://wes.casio.com/math/index.php?q=I-268F+U-000000000000+M-C10000AD00+S-401410101000100E1010B000A93C+R-0999999999999981009900000000000000000000+E-6F70716E6D6C31',
    expression: '\\mathrm{Arcsenh}( \\mathrm{Arccosh}( \\mathrm{Arctanh}( \\tanh( \\cosh( \\mathrm{senh}( 1',
  },
  {
    name: 'Calculate Spanish EY integer ASCII expression',
    url: 'http://wes.casio.com/ncal/index.php?q=I-011A+U-000000000000+M-C10014AD00+S-401410100000000E1010B000AC47+Q-03000000000000000000000001000900000000000000000000000100+E-3939AA603688352C3689352C36',
    expression: '9 9 ∟ ( 6 \\mathrm{MCD}( 5 , 6 \\mathrm{MCM}( 5 , 6',
  },
  {
    name: 'Calculate Spanish EY trigonometric ASCII expression',
    url: 'http://wes.casio.com/ncal/index.php?q=I-011A+U-000000000000+M-C10000AD00+S-401410100000000E1010B000ACE1+Q-09000000000000000007552801000000000000000000000000000000+E-7A7B7C79787739',
    expression: '\\mathrm{Arcsen}( \\mathrm{Arccos}( \\mathrm{Arctan}( \\tan( \\cos( \\mathrm{sen}( 9',
  },
  {
    name: 'Calculate Spanish EY hyperbolic ASCII expression',
    url: 'http://wes.casio.com/ncal/index.php?q=I-011A+U-000000000000+M-C10000AD00+S-401410100000000E1010B000ACE1+Q-09999999999999999999998800990000000000000000000000000000+E-6F70716E6D6C31',
    expression: '\\mathrm{Arcsenh}( \\mathrm{Arccosh}( \\mathrm{Arctanh}( \\tanh( \\cosh( \\mathrm{senh}( 1',
  },
];

for (const { name, url, expression } of asciiExpressionCases) {
  test(name, () => {
    assert.equal(parse(url).expression, expression);
  });
}

const recurringDecimalCases = [
  {
    name: 'Recurring decimal result with brackets',
    url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-C10000EE00+S-001410100000000E1010B00079F6+Q-02127659574468085106382900980000000000000000000000000000+E-31A93437',
    latex: '0 . \\left( 0 2 1 2 7 6 5 9 5 7 4 4 6 8 0 8 5 1 0 6 3 8 2 9 7 8 7 2 3 4 0 4 2 5 5 3 1 9 1 4 8 9 3 6 1 7 \\right) ',
  },
  {
    name: 'Recurring decimal result with an overline',
    url: 'http://wes.casio.com/ncal/index.php?q=I-015A+U-000000000000+M-C10000EE00+S-400410100000000E1010B000B412+Q-02127659574468085106382900980000000000000000000000000000+E-31A93437',
    latex: '0 , \\overline{0 2 1 2 7 6 5 9 5 7 4 4 6 8 0 8 5 1 0 6 3 8 2 9 7 8 7 2 3 4 0 4 2 5 5 3 1 9 1 4 8 9 3 6 1 7} ',
  },
  {
    name: 'Recurring decimal result with dots',
    url: 'http://wes.casio.com/ncal/index.php?q=I-031A+U-000000000000+M-C10000EE00+S-001410100000000E1110B000252B+Q-04347826086956521739130400980000000000000000000000000000+E-31A93233',
    latex: '0 . \\dot{0}43478260869565217391\\dot{3} ',
  },
  {
    name: 'Recurring decimal fraction result with brackets',
    url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-C10000EE00+S-001410100000000E1010B00079F6+Q-21A47000000000000000000001040000000000000000000000000000+E-C81D1A311B1A34371B1E',
    latex: '0 . \\left( 0 2 1 2 7 6 5 9 5 7 4 4 6 8 0 8 5 1 0 6 3 8 2 9 7 8 7 2 3 4 0 4 2 5 5 3 1 9 1 4 8 9 3 6 1 7 \\right) ',
  },
  {
    name: 'Recurring decimal fraction result with dots',
    url: 'http://wes.casio.com/math/index.php?q=I-243F+U-000000000000+M-C10000EE00+S-001410101000100E1110B0004249+R-21A5900000000000010400000000000000000000+E-C81D1A311B1A35391B1E',
    latex: '0 . \\dot{0}16949152542372881355932203389830508474576271186440677966\\dot{1} ',
  },
  {
    name: 'Recurring decimal mixed fraction result with an overline',
    url: 'http://wes.casio.com/ncal/index.php?q=I-544A+U-000000000000+M-C10000EE00+S-401410101000001E0000B0003CEE+Q-286A22A2300000000000000001080000000000000000000000000000+E-C81D1A323030301B1A32331B1E',
    latex: '86 . \\overline{9 5 6 5 2 1 7 3 9 1 3 0 4 3 4 7 8 2 6 0 8 6} ',
  },
  {
    name: 'Negative recurring decimal result with an overline',
    url: 'http://wes.casio.com/ncal/index.php?q=I-544A+U-000000000000+M-C10000EE00+S-401410101000001E0000B0003CEE+Q-08695652173913043478260806000000000000000000000000000000+E-C0323030A93233',
    latex: '-8 . \\overline{6 9 5 6 5 2 1 7 3 9 1 3 0 4 3 4 7 8 2 6 0 8} ',
  },
  {
    name: 'Recurring decimal result follows the configured decimal mark',
    url: 'http://wes.casio.com/ncal/index.php?q=I-031A+U-000000000000+M-C10000EE00+S-000410100000000E1010B0000E91+Q-08695652173913043470000001010000000000000000000000000000+E-38362E39353635323137333931333034333437',
    latex: '86 , \\dot{9}56521739130434782608\\dot{6} ',
  },
];

for (const { name, url, latex } of recurringDecimalCases) {
  test(name, () => {
    assert.equal(parse(url).result[0].latex, latex);
  });
}

const primeFactorCases = [
  {
    name: 'Prime factor result with one four-digit factor',
    url: 'http://wes.casio.com/ncal/index.php?q=I-544A+U-000000000000+M-C10000FF00+S-401410101000001E0000B000CBF1+Q-01005973000000000000000001060000000000000000000000000000+E-31303039A8393937',
    latex: '997 \\times 1009',
  },
  {
    name: 'Prime factor result at the unfactored threshold',
    url: 'http://wes.casio.com/ncal/index.php?q=I-544A+U-000000000000+M-C10000FF00+S-401410101000001E0000B000CBF1+Q-01018081000000000000000001060000000000000000000000000000+E-31303039A831303039',
    latex: '(1018081)',
  },
  {
    name: 'Prime factor result with a partially factored value',
    url: 'http://wes.casio.com/ncal/index.php?q=I-544A+U-000000000000+M-C10000FF00+S-401410101000001E0000B000CBF1+Q-02036162000000000000000001060000000000000000000000000000+E-32303336313632',
    latex: '2 \\times (1018081)',
  },
  {
    name: 'Prime factor result containing one four-digit prime',
    url: 'http://wes.casio.com/ncal/index.php?q=I-544A+U-000000000000+M-C10000FF00+S-401410101000001E0000B000CBF1+Q-01847000000000000000000001030000000000000000000000000000+E-31383437',
    latex: '1847',
  },
  {
    name: 'Prime factor result for a ten-digit integer',
    url: 'http://wes.casio.com/ncal/index.php?q=I-544A+U-000000000000+M-C10000FF00+S-401410101000001E0000B000CBF1+Q-09999999999000000000000001090000000000000000000000000000+E-39393939393939393939',
    latex: '3^{2} \\times 11 \\times 41 \\times 271 \\times 9091',
  },
];

for (const { name, url, latex } of primeFactorCases) {
  test(name, () => {
    assert.equal(parse(url).result[0].latex, latex);
  });
}

const localizationCases = [
  {
    "name": "Calculate localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-C10000AD00+S-001410101000000E1010B0002338+Q-09000000000000000007552801000000000000000000000000000000+E-7A7B7C79787739",
    "fields": [],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Calculate",
          "mainMode": "C1",
          "subMode": "00"
        },
        "format": {
          "displayName": "Decimal",
          "storeName": "Standard",
          "displayCode": "A",
          "storeCode": "D"
        },
        "setup": [
          {
            "name": "Number Format",
            "value": "Norm1",
            "type": "NUMBER_FORMAT",
            "code": "00"
          },
          {
            "name": "Input/Output",
            "value": "MathI/MathO",
            "type": "INPUT_OUTPUT",
            "code": "10"
          },
          {
            "name": "Decimal Mark",
            "value": "Dot",
            "type": "DECIMAL_MARK",
            "code": "1"
          },
          {
            "name": "Angle Unit",
            "value": "Degree",
            "type": "ANGLE_UNIT",
            "code": "4"
          },
          {
            "name": "Fraction Result",
            "value": "d/c",
            "type": "FRACTION_RESULT",
            "code": "0"
          },
          {
            "name": "Complex Result",
            "value": "a+bi",
            "type": "COMPLEX_RESULT",
            "code": "1"
          },
          {
            "name": "Statistics Frequency",
            "value": "Off",
            "type": "STATISTICS_FREQUENCY",
            "code": "0"
          },
          {
            "name": "Recurring Decimal",
            "value": "On",
            "type": "RECURRING_DECIMAL",
            "code": "1"
          },
          {
            "name": "Simplify",
            "value": "Auto",
            "type": "SIMPLIFY",
            "code": "0"
          },
          {
            "name": "Auto Power Off",
            "value": "10 Min.",
            "type": "AUTO_POWER_OFF",
            "code": "0"
          },
          {
            "name": "Table Type",
            "value": "f(x),g(x)",
            "type": "TABLE_TYPE",
            "code": "0"
          },
          {
            "name": "Engineer Symbol",
            "value": "Off",
            "type": "ENGINEER_SYMBOL",
            "code": "0"
          },
          {
            "name": "Digit Separator",
            "value": "Off",
            "type": "DIGIT_SEPARATOR",
            "code": "0"
          },
          {
            "name": "Multi-Line Font",
            "value": "Normal Font",
            "type": "MULTI_LINE_FONT",
            "code": "E"
          },
          {
            "name": "Equation Complex Root",
            "value": "On",
            "type": "EQUATION_COMPLEX_ROOT",
            "code": "1"
          },
          {
            "name": "Language",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          },
          {
            "name": "Spreadsheet: Auto Calc",
            "value": "On",
            "type": "SPREADSHEET_AUTO_CALC",
            "code": "1"
          },
          {
            "name": "Spreadsheet: Show Cell",
            "value": "Formula",
            "type": "SPREADSHEET_SHOW_CELL",
            "code": "0"
          },
          {
            "name": "QR Code Version",
            "value": "Version 11",
            "type": "QR_CODE_VERSION",
            "code": "B"
          },
          {
            "name": "Algorithm: Background",
            "value": "Axes",
            "type": "ALGORITHM_BACKGROUND",
            "code": "0"
          },
          {
            "name": "Algorithm: Unit Setting",
            "value": "pixels",
            "type": "ALGORITHM_UNIT_SETTING",
            "code": "0"
          }
        ]
      },
      "zh": {
        "mode": {
          "mainName": "计算",
          "mainMode": "C1",
          "subMode": "00"
        },
        "format": {
          "displayName": "小数",
          "storeName": "标准",
          "displayCode": "A",
          "storeCode": "D"
        },
        "setup": [
          {
            "name": "显示格式",
            "value": "常规1",
            "type": "NUMBER_FORMAT",
            "code": "00"
          },
          {
            "name": "输入/输出",
            "value": "数学输入/数学输出",
            "type": "INPUT_OUTPUT",
            "code": "10"
          },
          {
            "name": "小数点显示",
            "value": "句点",
            "type": "DECIMAL_MARK",
            "code": "1"
          },
          {
            "name": "角度单位",
            "value": "度(D)",
            "type": "ANGLE_UNIT",
            "code": "4"
          },
          {
            "name": "分数结果",
            "value": "假分数",
            "type": "FRACTION_RESULT",
            "code": "0"
          },
          {
            "name": "复数结果",
            "value": "a+bi",
            "type": "COMPLEX_RESULT",
            "code": "1"
          },
          {
            "name": "统计频数",
            "value": "关",
            "type": "STATISTICS_FREQUENCY",
            "code": "0"
          },
          {
            "name": "循环小数",
            "value": "开",
            "type": "RECURRING_DECIMAL",
            "code": "1"
          },
          {
            "name": "化简",
            "value": "自动",
            "type": "SIMPLIFY",
            "code": "0"
          },
          {
            "name": "自动关机",
            "value": "10分钟",
            "type": "AUTO_POWER_OFF",
            "code": "0"
          },
          {
            "name": "函数表格类型",
            "value": "f(x),g(x)",
            "type": "TABLE_TYPE",
            "code": "0"
          },
          {
            "name": "工程符号",
            "value": "关",
            "type": "ENGINEER_SYMBOL",
            "code": "0"
          },
          {
            "name": "数字分隔符",
            "value": "关",
            "type": "DIGIT_SEPARATOR",
            "code": "0"
          },
          {
            "name": "多行字体",
            "value": "普通字体",
            "type": "MULTI_LINE_FONT",
            "code": "E"
          },
          {
            "name": "方程复数根",
            "value": "开",
            "type": "EQUATION_COMPLEX_ROOT",
            "code": "1"
          },
          {
            "name": "语言",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          },
          {
            "name": "数据表格：自动计算",
            "value": "开",
            "type": "SPREADSHEET_AUTO_CALC",
            "code": "1"
          },
          {
            "name": "数据表格：显示单元格",
            "value": "公式",
            "type": "SPREADSHEET_SHOW_CELL",
            "code": "0"
          },
          {
            "name": "QR码版本",
            "value": "版本11",
            "type": "QR_CODE_VERSION",
            "code": "B"
          },
          {
            "name": "算法：运行时背景",
            "value": "坐标轴",
            "type": "ALGORITHM_BACKGROUND",
            "code": "0"
          },
          {
            "name": "算法：移动单位设置",
            "value": "像素",
            "type": "ALGORITHM_UNIT_SETTING",
            "code": "0"
          }
        ]
      },
      "vi": {
        "mode": {
          "mainName": "Phép tính thường",
          "mainMode": "C1",
          "subMode": "00"
        },
        "format": {
          "displayName": "Thập phân",
          "storeName": "Standard",
          "displayCode": "A",
          "storeCode": "D"
        },
        "setup": [
          {
            "name": "Định dạng số",
            "value": "Viết số bình thường 1",
            "type": "NUMBER_FORMAT",
            "code": "00"
          },
          {
            "name": "Nhập/Xuất",
            "value": "Số tự nhiên vào/ra",
            "type": "INPUT_OUTPUT",
            "code": "10"
          },
          {
            "name": "Dấu thập phân",
            "value": "Chấm",
            "type": "DECIMAL_MARK",
            "code": "1"
          },
          {
            "name": "Đơn vị góc",
            "value": "Độ",
            "type": "ANGLE_UNIT",
            "code": "4"
          },
          {
            "name": "Kết quả phân số",
            "value": "Phân số có thể viết thành hỗn số",
            "type": "FRACTION_RESULT",
            "code": "0"
          },
          {
            "name": "Kết quả số phức",
            "value": "a+bi",
            "type": "COMPLEX_RESULT",
            "code": "1"
          },
          {
            "name": "Tần số thống kê",
            "value": "Tắt",
            "type": "STATISTICS_FREQUENCY",
            "code": "0"
          },
          {
            "name": "Số thập phân tuần hoàn",
            "value": "Bật",
            "type": "RECURRING_DECIMAL",
            "code": "1"
          },
          {
            "name": "Rút gọn",
            "value": "Tự động",
            "type": "SIMPLIFY",
            "code": "0"
          },
          {
            "name": "Tự động tắt",
            "value": "10 phút",
            "type": "AUTO_POWER_OFF",
            "code": "0"
          },
          {
            "name": "Loại bảng",
            "value": "f(x),g(x)",
            "type": "TABLE_TYPE",
            "code": "0"
          },
          {
            "name": "Kí hiệu kĩ thuật",
            "value": "Tắt",
            "type": "ENGINEER_SYMBOL",
            "code": "0"
          },
          {
            "name": "Dấu cách 3 chữ số",
            "value": "Tắt",
            "type": "DIGIT_SEPARATOR",
            "code": "0"
          },
          {
            "name": "Phông Multi-Line",
            "value": "Phông chữ thường",
            "type": "MULTI_LINE_FONT",
            "code": "E"
          },
          {
            "name": "Nghiệm Phức Phương trình",
            "value": "Bật",
            "type": "EQUATION_COMPLEX_ROOT",
            "code": "1"
          },
          {
            "name": "Ngôn ngữ",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          },
          {
            "name": "Bảng tính: Tự động tính",
            "value": "Bật",
            "type": "SPREADSHEET_AUTO_CALC",
            "code": "1"
          },
          {
            "name": "Bảng tính: Hiện ô",
            "value": "Công thức",
            "type": "SPREADSHEET_SHOW_CELL",
            "code": "0"
          },
          {
            "name": "Phiên bản mã QR",
            "value": "Phiên bản 11",
            "type": "QR_CODE_VERSION",
            "code": "B"
          },
          {
            "name": "Thuật toán: Nền",
            "value": "Trục",
            "type": "ALGORITHM_BACKGROUND",
            "code": "0"
          },
          {
            "name": "Thuật toán: Cài đặt đơn vị",
            "value": "pixel",
            "type": "ALGORITHM_UNIT_SETTING",
            "code": "0"
          }
        ]
      },
      "fr": {
        "mode": {
          "mainName": "Calcul",
          "mainMode": "C1",
          "subMode": "00"
        },
        "format": {
          "displayName": "Décimal",
          "storeName": "Standard",
          "displayCode": "A",
          "storeCode": "D"
        },
        "setup": [
          {
            "name": "Arrondi",
            "value": "Norm1",
            "type": "NUMBER_FORMAT",
            "code": "00"
          },
          {
            "name": "Saisie/Résultat",
            "value": "Smaths/Rmaths",
            "type": "INPUT_OUTPUT",
            "code": "10"
          },
          {
            "name": "Signe décimal",
            "value": "Point",
            "type": "DECIMAL_MARK",
            "code": "1"
          },
          {
            "name": "Unité d’angle",
            "value": "Degré",
            "type": "ANGLE_UNIT",
            "code": "4"
          },
          {
            "name": "Résultat de fraction",
            "value": "Fraction impropre",
            "type": "FRACTION_RESULT",
            "code": "0"
          },
          {
            "name": "Forme complexe",
            "value": "a+bi",
            "type": "COMPLEX_RESULT",
            "code": "1"
          },
          {
            "name": "Effectif",
            "value": "Désactivé",
            "type": "STATISTICS_FREQUENCY",
            "code": "0"
          },
          {
            "name": "Décimale périodique",
            "value": "Activé",
            "type": "RECURRING_DECIMAL",
            "code": "1"
          },
          {
            "name": "Simplifier",
            "value": "Automatique",
            "type": "SIMPLIFY",
            "code": "0"
          },
          {
            "name": "Extinct auto",
            "value": "10 min",
            "type": "AUTO_POWER_OFF",
            "code": "0"
          },
          {
            "name": "Type de tableau",
            "value": "f(x),g(x)",
            "type": "TABLE_TYPE",
            "code": "0"
          },
          {
            "name": "Symbole d’ingénierie",
            "value": "Désactivé",
            "type": "ENGINEER_SYMBOL",
            "code": "0"
          },
          {
            "name": "Sépart chiffres",
            "value": "Désactivé",
            "type": "DIGIT_SEPARATOR",
            "code": "0"
          },
          {
            "name": "Pol multiligne",
            "value": "Police normale",
            "type": "MULTI_LINE_FONT",
            "code": "E"
          },
          {
            "name": "Racine complexe",
            "value": "Activé",
            "type": "EQUATION_COMPLEX_ROOT",
            "code": "1"
          },
          {
            "name": "Langue",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          },
          {
            "name": "Tableur : Calcul auto",
            "value": "Activé",
            "type": "SPREADSHEET_AUTO_CALC",
            "code": "1"
          },
          {
            "name": "Tableur : Afficher cell",
            "value": "Formule",
            "type": "SPREADSHEET_SHOW_CELL",
            "code": "0"
          },
          {
            "name": "Version du QR Code",
            "value": "Version 11",
            "type": "QR_CODE_VERSION",
            "code": "B"
          },
          {
            "name": "Algo : Arrière-plan",
            "value": "Axes",
            "type": "ALGORITHM_BACKGROUND",
            "code": "0"
          },
          {
            "name": "Algo : Réglage unité",
            "value": "pixels",
            "type": "ALGORITHM_UNIT_SETTING",
            "code": "0"
          }
        ]
      }
    }
  }
];

for (const { name, url, fields, expected } of localizationCases) {
  for (const [language, localizedExpected] of Object.entries(expected)) {
    test(`${name} (${language})`, () => {
      assert.deepEqual(
        projectLocalization(parse(url, language), fields),
        localizedExpected,
      );
    });
  }
}
