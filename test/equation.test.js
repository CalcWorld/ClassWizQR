import assert from 'node:assert/strict';
import { test } from 'vitest';

import { assertSetupUnorderedEqual, parse, projectLocalization, projectResult } from './support/parser.js';
import { ParseEquation } from '../src/variable/C.js';

// Sources: ../ClassWizQR.wiki/Equation-Mode.md
const cases = [
  {
    "name": "Equation sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-4501BD0000+S-001410101000000E1010B0005CCA+R-EQ023A5000000000000060321A4A500000000000105+C-010000000000000001000200000000000000010003000000000000000100060000000000000001000700000000000000010009000000000000000100",
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
        "mainName": "Equation",
        "subName": "Simultaneous Equation with 2 Unknowns",
        "mainMode": "45",
        "subMode": "01"
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
        "equation",
        "result"
      ],
      "equation": {
        "latex": "\\left\\{\\begin{array}{l} x +2y = 3 \\\\ 6x +7y = 9 \\end{array}\\right.",
        "decimal": [
          "1",
          "2",
          "3",
          "6",
          "7",
          "9"
        ],
        "element": [
          [
            "1",
            "2",
            "3"
          ],
          [
            "6",
            "7",
            "9"
          ]
        ]
      },
      "result": [
        {
          "name": "templated",
          "latex": "x=- \\dfrac {\\displaystyle 3} {\\displaystyle 5} \\\\ y= \\dfrac {\\displaystyle 9} {\\displaystyle 5}"
        },
        {
          "name": "Part1",
          "latex": "- \\dfrac {\\displaystyle 3} {\\displaystyle 5}",
          "decimal": "-0.6"
        },
        {
          "name": "Part2",
          "latex": " \\dfrac {\\displaystyle 9} {\\displaystyle 5}",
          "decimal": "1.8"
        }
      ]
    }
  },
  {
    "name": "Equation sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-4504AD0000+S-001410101000000E1010B000CCE2+R-EQ00100000000000000060080000001000201010001010000000000000006008000000100020101000601000000000000000600000000000000000000000200000000000000010000000000000000000000+C-010000000000000001000200000000000000010003000000000000000100",
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
        "mainName": "Equation",
        "subName": "Quadratic Equation [ax²+bx+c=0]",
        "mainMode": "45",
        "subMode": "04"
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
        "equation",
        "result"
      ],
      "equation": {
        "latex": "x^2 +2x +3 = 0",
        "decimal": [
          "1",
          "2",
          "3"
        ],
        "element": [
          [
            "1",
            "2",
            "3"
          ]
        ]
      },
      "result": [
        {
          "name": "templated",
          "latex": "x_1=-1  +  \\sqrt{2} i \\\\ x_2=-1 - \\sqrt{2} i \\\\ x_{min}=-1 \\\\ y_{min}=2"
        },
        {
          "name": "Part1",
          "latex": "-1",
          "decimal": "-1"
        },
        {
          "name": "Part2",
          "latex": " \\sqrt{2} ",
          "decimal": "1.4142135623730950488"
        },
        {
          "name": "Part3",
          "latex": "-1",
          "decimal": "-1"
        },
        {
          "name": "Part4",
          "latex": "- \\sqrt{2} ",
          "decimal": "-1.4142135623730950488"
        },
        {
          "name": "Part5",
          "latex": "-1",
          "decimal": "-1"
        },
        {
          "name": "Part6",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "Part7",
          "latex": "2",
          "decimal": "2"
        },
        {
          "name": "Part8",
          "latex": "0",
          "decimal": "0"
        }
      ]
    }
  },
  {
    "name": "Equation sample 3",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-450813AA47+S-001410101000000E1010B000EEA5+Q-02000000000000000000000001000000000000000000000000000000+E-47C91A321BA63247A631A739",
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
        "mainName": "Equation",
        "subName": "Solver",
        "mainMode": "45",
        "subMode": "08"
      },
      "format": {
        "displayName": "Decimal",
        "storeName": "Decimal",
        "displayCode": "A",
        "storeCode": "A"
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
      "expression": "x ^{2}  + 2 x + 1 - 9",
      "result": [
        {
          "name": "templated",
          "latex": "x=2,L-R=0"
        },
        {
          "name": "Part1",
          "latex": "2",
          "decimal": "2"
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
    assertSetupUnorderedEqual(projectResult(parse(url)), expected);
  });
}

const linearEquationCases = [
  {
    name: 'omits a zero right-hand variable term and renders a zero right-hand side',
    url: 'http://wes.casio.com/ncal/index.php?q=I-506A+U-000000000000+M-4512BD0000+S-400410111000000E0010B000D1B7+R-EQ021A2A300000000000605+C-03000000000000000100050000000000000001000000000000000000000000000000000000000000',
    latex: '3x +5 = 0',
  },
  {
    name: 'renders non-zero terms on both sides',
    url: 'http://wes.casio.com/ncal/index.php?q=I-506A+U-000000000000+M-4512BD0000+S-400410111000000E0010B000D1B7+R-EQ022A30000000000000103+C-03000000000000000100050000000000000001000600000000000000010003000000000000000100',
    latex: '3x +5 = 6x +3',
  },
  {
    name: 'omits a zero right-hand variable term without dropping the relation',
    url: 'http://wes.casio.com/ncal/index.php?q=I-506A+U-000000000000+M-4512BD0000+S-400410111000000E0010B000D1B7+R-EQ022A30000000000000603+C-03000000000000000100050000000000000001000000000000000000000003000000000000000100',
    latex: '3x +5 = 3',
  },
  {
    name: 'omits a zero left-hand variable term',
    url: 'http://wes.casio.com/ncal/index.php?q=I-506A+U-000000000000+M-4512BD0000+S-400410111000000E0010B000D1B7+R-EQ021A30000000000000103+C-00000000000000000000050000000000000001000600000000000000010003000000000000000100',
    latex: '5 = 6x +3',
  },
];

for (const { name, url, latex } of linearEquationCases) {
  test(`Linear equation: ${name}`, () => {
    assert.equal(parse(url).equation.latex, latex);
  });
}

const generatedEquationCases = [
  {
    name: 'two-variable simultaneous equation',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4501AD0000+S-401410111000000E1010B0001012+R-EQ00100000000000000060001000000000000000600+C-010000000000000001000100000000000000060000000000000000000000000000000000000000000200000000000000010002000000000000000600',
    latex: '\\left\\{\\begin{array}{l} x -y = 0 \\\\ 2y = -2 \\end{array}\\right.',
    decimal: ['1', '-1', '0', '0', '2', '-2'],
  },
  {
    name: 'three-variable simultaneous equation',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4502BD0000+S-401410111000000E1010B0009634+R-EQ021A2A70000000000060522A1A70000000000060522A4A700000000000605+C-000000000000000000000100000000000000010002000000000000000600030000000000000001000100000000000000060002000000000000000100000000000000000000000300000000000000060002000000000000000100000000000000000000000100000000000000060000000000000000000000',
    latex: '\\left\\{\\begin{array}{l} y -2z = 3 \\\\ -x +2y = -3 \\\\ 2x -z = 0 \\end{array}\\right.',
    decimal: ['0', '1', '-2', '3', '-1', '2', '0', '-3', '2', '0', '-1', '0'],
  },
  {
    name: 'four-variable simultaneous equation with an all-zero row',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4503DD0000+S-401410111000000E1010B000F4C7+R-EQ1+C-0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000001000100000000000000060002000000000000000100020000000000000006000300000000000000010001000000000000000600010000000000000001000000000000000000000002000000000000000100030000000000000006000200000000000000010000000000000000000000010000000000000006000100000000000000010000000000000000000000',
    latex: '\\left\\{\\begin{array}{l} 0 = 0 \\\\ x -y +2z -2t = 3 \\\\ -x +y +2t = -3 \\\\ 2x -z +t = 0 \\end{array}\\right.',
    decimal: ['0', '0', '0', '0', '0', '1', '-1', '2', '-2', '3', '-1', '1', '0', '2', '-3', '2', '0', '-1', '1', '0'],
  },
  {
    name: 'one-sided linear equation with unit coefficient',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4511AD0000+S-401410111000000E1010B0005FAA+R-EQ001000000000000000100+C-0100000000000000010001000000000000000600',
    latex: 'x -1 = 0',
    decimal: ['1', '-1'],
  },
  {
    name: 'one-sided linear equation with negative unit coefficient',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4511AD0000+S-401410111000000E1010B0005FAA+R-EQ002000000000000000100+C-0100000000000000060002000000000000000100',
    latex: '-x +2 = 0',
    decimal: ['-1', '2'],
  },
  {
    name: 'one-sided linear equation with zero constant',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4511AD0000+S-401410111000000E1010B0005FAA+R-EQ000000000000000000000+C-0200000000000000010000000000000000000000',
    latex: '2x = 0',
    decimal: ['2', '0'],
  },
  {
    name: 'two-sided linear equation with unit signs',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4512AD0000+S-401410111000000E1010B000627A+R-EQ001000000000000000100+C-01000000000000000100010000000000000006000100000000000000060001000000000000000100',
    latex: 'x -1 = -x +1',
    decimal: ['1', '-1', '-1', '1'],
  },
  {
    name: 'two-sided linear equation with leading negative unit',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4512AD0000+S-401410111000000E1010B000627A+R-EQ002000000000000000100+C-01000000000000000600020000000000000001000100000000000000010002000000000000000600',
    latex: '-x +2 = x -2',
    decimal: ['-1', '2', '1', '-2'],
  },
  {
    name: 'two-sided linear equation omitting the right variable',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4512BD0000+S-401410111000000E1010B000906C+R-EQ021A1A200000000000105+C-02000000000000000100000000000000000000000000000000000000000003000000000000000100',
    latex: '2x = 3',
    decimal: ['2', '0', '0', '3'],
  },
  {
    name: 'two-sided linear equation omitting the left variable',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4512AD0000+S-401410111000000E1010B000627A+R-EQ001000000000000000600+C-00000000000000000000020000000000000006000200000000000000010000000000000000000000',
    latex: '-2 = 2x',
    decimal: ['0', '-2', '2', '0'],
  },
  {
    name: 'two-sided linear equation with decimal and fractional coefficients',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4512AD0000+S-401410111000000E1010B000627A+R-EQ003000000000000000100+C-05000000000000000099012500000000000006000333333333333333009907500000000000000599',
    latex: ' \\dfrac {\\displaystyle 1} {\\displaystyle 2}x - \\dfrac {\\displaystyle 5} {\\displaystyle 4} =  \\dfrac {\\displaystyle 1} {\\displaystyle 3}x - \\dfrac {\\displaystyle 3} {\\displaystyle 4}',
    decimal: ['0.5', '-1.25', '0.333333333333333', '-0.75'],
  },
  {
    name: 'quadratic equation covering unit, zero and negative coefficients',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4504DD0000+S-401410111000000E1010B0008D54+R-EQ08000000100020101000100000000000000000000800000010002010100060000000000000000000000000000000000000000000000000000000000000200000000000000060000000000000000000000+C-010000000000000001000000000000000000000002000000000000000600',
    latex: 'x^2 -2 = 0',
    decimal: ['1', '0', '-2'],
  },
  {
    name: 'quadratic equation covering negative unit, positive and zero coefficients',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4504AD0000+S-401410111000000E1010B0008B61+R-EQ00200000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000100000000000000000000000100000000000000010000000000000000000000+C-010000000000000006000200000000000000010000000000000000000000',
    latex: '-x^2 +2x = 0',
    decimal: ['-1', '2', '0'],
  },
  {
    name: 'quadratic equation with internal negative unit coefficient',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4504DD0000+S-401410111000000E1010B0008D54+R-EQ021A400000000000001038000000100230104000121A400000000000001038000000100230104000602500000000000000099000000000000000000000287500000000000010000000000000000000000+C-020000000000000001000100000000000000060003000000000000000100',
    latex: '2x^2 -x +3 = 0',
    decimal: ['2', '-1', '3'],
  },
  {
    name: 'quadratic equation with fractional coefficients',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4504DD0000+S-401410111000000E1010B0008D54+R-EQ023A400000000000001038000000100310104000123A400000000000001038000000100310104000607500000000000000099000000000000000000000968750000000000009900000000000000000000+C-050000000000000000990750000000000000059901250000000000000100',
    latex: ' \\dfrac {\\displaystyle 1} {\\displaystyle 2}x^2 - \\dfrac {\\displaystyle 3} {\\displaystyle 4}x + \\dfrac {\\displaystyle 5} {\\displaystyle 4} = 0',
    decimal: ['0.5', '-0.75', '1.25'],
  },
  {
    name: 'cubic equation covering unit, zero and negative coefficients',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4505AD0000+S-401410111000000E1010B0000830+R-EQ001521379706804560600000000000000000000000760689853402283009908578736265951780099076068985340228300990857873626595178059980000001000301030006800102010003020901018000000100030103000180010201000302090106+C-01000000000000000100000000000000000000000100000000000000060002000000000000000100',
    latex: 'x^3 -x +2 = 0',
    decimal: ['1', '0', '-1', '2'],
  },
  {
    name: 'cubic equation covering leading negative unit and zero constant',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4505AD0000+S-401410111000000E1010B0000830+R-EQ5010000000000000001000100000000000000010001000000000000000100010000000000000006000000000000000000000000000000000000000000+C-01000000000000000600020000000000000001000200000000000000060000000000000000000000',
    latex: '-x^3 +2x^2 -2x = 0',
    decimal: ['-1', '2', '-2', '0'],
  },
  {
    name: 'cubic equation with fractional coefficients',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4505AD0000+S-401410111000000E1010B0000830+R-EQ003047089459348390100000000000000000000000235447296741976059801215016367899960100023544729674197605980121501636789996060080010101000501030106800131120005052706018001010100050103010180013112000505270606+C-05000000000000000099015000000000000006000666666666666666009902250000000000000600',
    latex: ' \\dfrac {\\displaystyle 1} {\\displaystyle 2}x^3 - \\dfrac {\\displaystyle 3} {\\displaystyle 2}x^2 + \\dfrac {\\displaystyle 2} {\\displaystyle 3}x - \\dfrac {\\displaystyle 9} {\\displaystyle 4} = 0',
    decimal: ['0.5', '-1.5', '0.666666666666666', '-2.25'],
  },
  {
    name: 'quartic equation covering all coefficient sign states',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4506AD0000+S-401410111000000E1010B0007DB6+R-EQ00999999999999999009900000000000000000000080376088336891105990000000000000000000001518804416844550099011050264464632701000151880441684455009901105026446463270600+C-0200000000000000010001000000000000000600010000000000000001000000000000000000000002000000000000000600',
    latex: '2x^4 -x^3 +x^2 -2 = 0',
    decimal: ['2', '-1', '1', '0', '-2'],
  },
  {
    name: 'quartic equation with fractional coefficients',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4506AD0000+S-401410111000000E1010B0007DB6+R-EQ00195057874886085010007069837789718050099019505787488608501000706983778971805059907005787488608540599081898838522518900990700578748860854059908189883852251890599+C-0500000000000000009901250000000000000600000000000000000000000750000000000000009902500000000000000100',
    latex: ' \\dfrac {\\displaystyle 1} {\\displaystyle 2}x^4 - \\dfrac {\\displaystyle 5} {\\displaystyle 4}x^3 + \\dfrac {\\displaystyle 3} {\\displaystyle 4}x + \\dfrac {\\displaystyle 5} {\\displaystyle 2} = 0',
    decimal: ['0.5', '-1.25', '0', '0.75', '2.5'],
  },
];

for (const { name, url, latex, decimal } of generatedEquationCases) {
  test(`Generated equation QR: ${name}`, () => {
    const equation = parse(url).equation;
    assert.equal(equation.latex, latex);
    assert.deepEqual(equation.decimal.map(String), decimal);
  });
}

const complexRootCases = [
  {
    name: 'quadratic roots enabled',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4504AD0000+S-401410111000000E1010B0008B61+R-EQ00000000000000000000001000000000000000100000000000000000000000100000000000000060000000000000000000000000000000000000000000100000000000000010000000000000000000000+C-010000000000000001000000000000000000000001000000000000000100',
    latex: 'x^2 +1 = 0',
    settingCode: '1',
    resultLength: 9,
    resultLatex: 'x_1=i \\\\ x_2=- i \\\\ x_{min}=0 \\\\ y_{min}=1',
  },
  {
    name: 'cubic roots enabled',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4505AD0000+S-401410111000000E1010B0000830+R-EQ5010000000000000006000000000000000000000021A200000000000001038000000100030102000121A2000000000000010380000001000301020006+C-01000000000000000100000000000000000000000000000000000000000001000000000000000100',
    latex: 'x^3 +1 = 0',
    settingCode: '1',
    resultLength: 7,
    resultLatex: 'x_1=-1 \\\\ x_2= \\dfrac {\\displaystyle 1} {\\displaystyle 2}  + \\dfrac {\\displaystyle  \\sqrt{3} } {\\displaystyle 2}i \\\\ x_3= \\dfrac {\\displaystyle 1} {\\displaystyle 2} -\\dfrac {\\displaystyle  \\sqrt{3} } {\\displaystyle 2}i \\\\ No Local Max/Min',
  },
  {
    name: 'cubic roots disabled',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4505AD0000+S-401410111000000E0010B000CE37+R-EQ50100000000000000060000000000000000000000+C-01000000000000000100000000000000000000000000000000000000000001000000000000000100',
    latex: 'x^3 +1 = 0',
    settingCode: '0',
    resultLength: 3,
    resultLatex: 'x=-1 \\\\ No Local Max/Min',
  },
  {
    name: 'quartic roots enabled',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4506AD0000+S-401410111000000E1010B0007DB6+R-EQ00100000000000000010000000000000000000000010000000000000006000000000000000000000000000000000000000000010000000000000001000000000000000000000001000000000000000600+C-0100000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000600',
    latex: 'x^4 -1 = 0',
    settingCode: '1',
    resultLength: 9,
    resultLatex: 'x_1=1 \\\\ x_2=-1 \\\\ x_3=i \\\\ x_4=- i',
  },
  {
    name: 'quartic roots disabled',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4506AD0000+S-401410111000000E0010B000F66B+R-EQ001000000000000000100000000000000000000000100000000000000060000000000000000000000+C-0100000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000600',
    latex: 'x^4 -1 = 0',
    settingCode: '0',
    resultLength: 5,
    resultLatex: 'x_1=1 \\\\ x_2=-1',
  },
];

for (const { name, url, latex, settingCode, resultLength, resultLatex } of complexRootCases) {
  test(`Complex-root result count: ${name}`, () => {
    const parsed = parse(url);
    const setting = parsed.setup.find(({ type }) => type === 'EQUATION_COMPLEX_ROOT');

    assert.equal(parsed.equation.latex, latex);
    assert.equal(setting.code, settingCode);
    assert.equal(parsed.result.length, resultLength);
    assert.equal(parsed.result[0].latex, resultLatex);
  });
}

const equationResultTemplateCases = [
  {
    name: 'quadratic single root without extrema',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4504AD0000+S-401410101000000E1010B000EC5A+R-EQ00100000000000000010000000000000000000000+C-010000000000000001000200000000000000060001000000000000000100',
    equationLatex: 'x^2 -2x +1 = 0',
    resultLength: 3,
    resultLatex: 'x=1',
  },
  {
    name: 'quadratic two roots without extrema',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4504AD0000+S-401410101000000E1010B000EC5A+R-EQ001000000000000000100000000000000000000000100000000000000060000000000000000000000+C-010000000000000001000000000000000000000001000000000000000600',
    equationLatex: 'x^2 -1 = 0',
    resultLength: 5,
    resultLatex: 'x_1=1 \\\\ x_2=-1',
  },
  {
    name: 'quadratic no real roots without extrema',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4504DD0000+S-401410101000000E0010B0000362+R-EQ4+C-010000000000000001000000000000000000000001000000000000000100',
    equationLatex: 'x^2 +1 = 0',
    resultLength: 1,
    resultLatex: 'No Real Roots',
    settingCode: '0',
  },
  {
    name: 'quadratic single root with extrema',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4504AD0000+S-401410111000000E1010B0008B61+R-EQ0010000000000000001000000000000000000000001000000000000000100000000000000000000000000000000000000000000000000000000000000+C-010000000000000001000200000000000000060001000000000000000100',
    equationLatex: 'x^2 -2x +1 = 0',
    resultLength: 7,
    resultLatex: 'x=1 \\\\ x_{min}=1 \\\\ y_{min}=0',
    settingCode: '1',
  },
  {
    name: 'quadratic no real roots with extrema',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4504DD0000+S-401410111000000E0010B000CAF3+R-EQ400000000000000000000000000000000000000000100000000000000010000000000000000000000+C-010000000000000001000000000000000000000001000000000000000100',
    equationLatex: 'x^2 +1 = 0',
    resultLength: 5,
    resultLatex: 'No Real Roots \\\\ x_{min}=0 \\\\ y_{min}=1',
    settingCode: '0',
  },
  {
    name: 'cubic two roots without extrema',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4505AD0000+S-401410101000000E1010B0003403+R-EQ002000000000000000600000000000000000000000100000000000000010000000000000000000000+C-01000000000000000100000000000000000000000300000000000000060002000000000000000100',
    equationLatex: 'x^3 -3x +2 = 0',
    resultLength: 5,
    resultLatex: 'x_1=-2 \\\\ x_2=1',
  },
  {
    name: 'cubic three roots without extrema',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4505AD0000+S-401410101000000E1010B0003403+R-EQ0010000000000000001000000000000000000000021A200000000000006030866025403784438009921A2000000000000060308660254037844380599+C-01000000000000000100000000000000000000000000000000000000000001000000000000000600',
    equationLatex: 'x^3 -1 = 0',
    resultLength: 7,
    resultIncludes: ['x_1=1', 'x_2=', 'x_3=', 'i'],
    resultDecimals: [1, 0, -0.5, Math.sqrt(3) / 2, -0.5, -Math.sqrt(3) / 2],
  },
  {
    name: 'cubic two roots with extrema',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4505AD0000+S-401410111000000E1010B0000830+R-EQ00200000000000000060000000000000000000000010000000000000001000000000000000000000001000000000000000600040000000000000001000100000000000000010000000000000000000000+C-01000000000000000100000000000000000000000300000000000000060002000000000000000100',
    equationLatex: 'x^3 -3x +2 = 0',
    resultLength: 9,
    resultLatex: 'x_1=-2 \\\\ x_2=1 \\\\ x_{max}=-1 \\\\ y_{max}=4 \\\\ x_{min}=1 \\\\ y_{min}=0',
    settingCode: '1',
  },
  {
    name: 'cubic one real root with complex roots disabled',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4505AD0000+S-401410101000000E0010B0006D7F+R-EQ00100000000000000060000000000000000000000+C-01000000000000000100000000000000000000000000000000000000000001000000000000000100',
    equationLatex: 'x^3 +1 = 0',
    resultLength: 3,
    resultLatex: 'x=-1',
    settingCode: '0',
  },
  {
    name: 'quartic single root',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4506AD0000+S-401410101000000E1010B0008A0F+R-EQ00000000000000000000000000000000000000000+C-0100000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    equationLatex: 'x^4 = 0',
    resultLength: 3,
    resultLatex: 'x=0',
  },
  {
    name: 'cubic one real root with extrema',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-4505AD0000+S-401410111000000E0010B000CE37+R-EQ0015213797068045606000000000000000000000080000001000301030006800102010003020901018000000100030103000180010201000302090106+C-01000000000000000100000000000000000000000100000000000000060002000000000000000100',
    equationLatex: 'x^3 -x +2 = 0',
    resultLength: 7,
    resultIncludes: ['x=-1.52137970680456', 'x_{max}=', 'y_{max}=', 'x_{min}=', 'y_{min}='],
    resultDecimals: [
      -1.5213797068045676,
      0,
      -Math.sqrt(3) / 3,
      (18 + 2 * Math.sqrt(3)) / 9,
      Math.sqrt(3) / 3,
      (18 - 2 * Math.sqrt(3)) / 9,
    ],
    settingCode: '0',
  },
  {
    name: 'quartic three roots',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4506AD0000+S-401410101000000E1010B0008A0F+R-EQ0010000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000060000000000000000000000+C-0100000000000000010000000000000000000000010000000000000006000000000000000000000000000000000000000000',
    equationLatex: 'x^4 -x^2 = 0',
    resultLength: 7,
    resultLatex: 'x_1=1 \\\\ x_2=0 \\\\ x_3=-1',
  },
  {
    name: 'four-variable simultaneous equation unique solution',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4503AD0000+S-401410101000000E0010B000F44D+R-EQ001000000000000000100020000000000000001000300000000000000010004000000000000000100+C-0100000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000100000000000000000000000100000000000000010000000000000000000000000000000000000000000200000000000000010000000000000000000000000000000000000000000100000000000000010000000000000000000000030000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000010004000000000000000100',
    equationLatex: '\\left\\{\\begin{array}{l} x = 1 \\\\ y = 2 \\\\ z = 3 \\\\ t = 4 \\end{array}\\right.',
    resultLength: 5,
    resultLatex: 'x=1 \\\\ y=2 \\\\ z=3 \\\\ t=4',
  },
  {
    name: 'simultaneous equation no solution',
    url: 'http://wes.casio.com/ncal/index.php?q=I-535A+U-000000000000+M-4501DD0000+S-401410101000000E0010B000D984+R-EQ2+C-010000000000000001000100000000000000010001000000000000000100010000000000000001000100000000000000010002000000000000000100',
    equationLatex: '\\left\\{\\begin{array}{l} x +y = 1 \\\\ x +y = 2 \\end{array}\\right.',
    resultLength: 1,
    resultLatex: 'No Solution',
  },
];

for (const {
  name,
  url,
  equationLatex,
  resultLength,
  resultLatex,
  resultIncludes = [],
  resultDecimals,
  settingCode,
} of equationResultTemplateCases) {
  test(`Equation result template: ${name}`, () => {
    const parsed = parse(url);

    assert.equal(parsed.equation.latex, equationLatex);
    assert.equal(parsed.result.length, resultLength);
    if (resultLatex) assert.equal(parsed.result[0].latex, resultLatex);
    for (const fragment of resultIncludes) {
      assert.ok(parsed.result[0].latex.includes(fragment));
    }
    if (resultDecimals) {
      assert.equal(parsed.result.length - 1, resultDecimals.length);
      parsed.result.slice(1).forEach(({ decimal }, index) => {
        assert.ok(
          Math.abs(Number(decimal) - resultDecimals[index]) < 1e-10,
          'Part' + (index + 1) + ' differs from the independently calculated value',
        );
      });
    }
    if (settingCode) {
      const setting = parsed.setup.find(({ type }) => type === 'EQUATION_COMPLEX_ROOT');
      assert.equal(setting.code, settingCode);
    }
  });
}

const ZERO_COEFFICIENT = '00000000000000000000';
const ONE_COEFFICIENT = '01000000000000000100';
const TWO_COEFFICIENT = '02000000000000000100';
const THREE_COEFFICIENT = '03000000000000000100';
const EQUATION_SETUP = '001410101000000E1010B000CCE2';

test('Equation rows render zero when every term on either side is omitted', () => {
  const simultaneous = ParseEquation({
    C: ZERO_COEFFICIENT.repeat(6),
    M: '4501BD0000',
    S: EQUATION_SETUP,
  });
  const linear = ParseEquation({
    C: ZERO_COEFFICIENT.repeat(4),
    M: '4512BD0000',
    S: EQUATION_SETUP,
  });

  assert.equal(
    simultaneous.latex,
    '\\left\\{\\begin{array}{l} 0 = 0 \\\\ 0 = 0 \\end{array}\\right.',
  );
  assert.equal(linear.latex, '0 = 0');
});

test('Ratio templates retain their colon and equality delimiters', () => {
  const ratio = ParseEquation({
    C: ONE_COEFFICIENT + TWO_COEFFICIENT + THREE_COEFFICIENT,
    M: '4A01BD0000',
    S: EQUATION_SETUP,
  });

  assert.equal(ratio.latex, '1 :2 = X:3');
});

const localizationCases = [
  {
    "name": "Equation localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-4501BD0000+S-001410101000000E1010B0005CCA+R-EQ023A5000000000000060321A4A500000000000105+C-010000000000000001000200000000000000010003000000000000000100060000000000000001000700000000000000010009000000000000000100",
    "fields": [
      "equation",
      "result"
    ],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Equation",
          "subName": "Simultaneous Equation with 2 Unknowns",
          "mainMode": "45",
          "subMode": "01"
        },
        "format": {
          "displayName": "Improper Fraction",
          "storeName": "Standard",
          "displayCode": "B",
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
            "value": "English",
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
        ],
        "equation": {
          "latex": "\\left\\{\\begin{array}{l} x +2y = 3 \\\\ 6x +7y = 9 \\end{array}\\right.",
          "decimal": [
            "1",
            "2",
            "3",
            "6",
            "7",
            "9"
          ],
          "element": [
            [
              "1",
              "2",
              "3"
            ],
            [
              "6",
              "7",
              "9"
            ]
          ]
        },
        "result": [
          {
            "name": "templated",
            "latex": "x=- \\dfrac {\\displaystyle 3} {\\displaystyle 5} \\\\ y= \\dfrac {\\displaystyle 9} {\\displaystyle 5}"
          },
          {
            "name": "Part1",
            "latex": "- \\dfrac {\\displaystyle 3} {\\displaystyle 5}",
            "decimal": "-0.6"
          },
          {
            "name": "Part2",
            "latex": " \\dfrac {\\displaystyle 9} {\\displaystyle 5}",
            "decimal": "1.8"
          }
        ]
      },
      "zh": {
        "mode": {
          "mainName": "方程",
          "subName": "二元一次方程组",
          "mainMode": "45",
          "subMode": "01"
        },
        "format": {
          "displayName": "假分数",
          "storeName": "标准",
          "displayCode": "B",
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
            "value": "English (英语)",
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
        ],
        "equation": {
          "latex": "\\left\\{\\begin{array}{l} x +2y = 3 \\\\ 6x +7y = 9 \\end{array}\\right.",
          "decimal": [
            "1",
            "2",
            "3",
            "6",
            "7",
            "9"
          ],
          "element": [
            [
              "1",
              "2",
              "3"
            ],
            [
              "6",
              "7",
              "9"
            ]
          ]
        },
        "result": [
          {
            "name": "templated",
            "latex": "x=- \\dfrac {\\displaystyle 3} {\\displaystyle 5} \\\\ y= \\dfrac {\\displaystyle 9} {\\displaystyle 5}"
          },
          {
            "name": "Part1",
            "latex": "- \\dfrac {\\displaystyle 3} {\\displaystyle 5}",
            "decimal": "-0.6"
          },
          {
            "name": "Part2",
            "latex": " \\dfrac {\\displaystyle 9} {\\displaystyle 5}",
            "decimal": "1.8"
          }
        ]
      },
      "vi": {
        "mode": {
          "mainName": "Phương trình",
          "subName": "Phương trình tuyến tính đồng thời với 2 ẩn",
          "mainMode": "45",
          "subMode": "01"
        },
        "format": {
          "displayName": "Phân số có thể viết thành hỗn số",
          "storeName": "Standard",
          "displayCode": "B",
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
            "value": "English (Tiếng Anh)",
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
        ],
        "equation": {
          "latex": "\\left\\{\\begin{array}{l} x +2y = 3 \\\\ 6x +7y = 9 \\end{array}\\right.",
          "decimal": [
            "1",
            "2",
            "3",
            "6",
            "7",
            "9"
          ],
          "element": [
            [
              "1",
              "2",
              "3"
            ],
            [
              "6",
              "7",
              "9"
            ]
          ]
        },
        "result": [
          {
            "name": "templated",
            "latex": "x=- \\dfrac {\\displaystyle 3} {\\displaystyle 5} \\\\ y= \\dfrac {\\displaystyle 9} {\\displaystyle 5}"
          },
          {
            "name": "Part1",
            "latex": "- \\dfrac {\\displaystyle 3} {\\displaystyle 5}",
            "decimal": "-0.6"
          },
          {
            "name": "Part2",
            "latex": " \\dfrac {\\displaystyle 9} {\\displaystyle 5}",
            "decimal": "1.8"
          }
        ]
      },
      "fr": {
        "mode": {
          "mainName": "Équation",
          "subName": "Équations simultanées à 2 inconnues",
          "mainMode": "45",
          "subMode": "01"
        },
        "format": {
          "displayName": "Fraction impropre",
          "storeName": "Standard",
          "displayCode": "B",
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
            "value": "English (Anglais)",
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
        ],
        "equation": {
          "latex": "\\left\\{\\begin{array}{l} x +2y = 3 \\\\ 6x +7y = 9 \\end{array}\\right.",
          "decimal": [
            "1",
            "2",
            "3",
            "6",
            "7",
            "9"
          ],
          "element": [
            [
              "1",
              "2",
              "3"
            ],
            [
              "6",
              "7",
              "9"
            ]
          ]
        },
        "result": [
          {
            "name": "templated",
            "latex": "x=- \\dfrac {\\displaystyle 3} {\\displaystyle 5} \\\\ y= \\dfrac {\\displaystyle 9} {\\displaystyle 5}"
          },
          {
            "name": "Part1",
            "latex": "- \\dfrac {\\displaystyle 3} {\\displaystyle 5}",
            "decimal": "-0.6"
          },
          {
            "name": "Part2",
            "latex": " \\dfrac {\\displaystyle 9} {\\displaystyle 5}",
            "decimal": "1.8"
          }
        ]
      }
    }
  }
];

for (const { name, url, fields, expected } of localizationCases) {
  for (const [language, localizedExpected] of Object.entries(expected)) {
    test(`${name} (${language})`, () => {
      assertSetupUnorderedEqual(
        projectLocalization(parse(url, language), fields),
        localizedExpected,
      );
    });
  }
}
