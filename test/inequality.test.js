import assert from 'node:assert/strict';
import { test } from 'vitest';

import { assertSetupUnorderedEqual, parse, projectLocalization, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Inequality-Mode.md
const cases = [
  {
    "name": "Inequality sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-4B04DD0000+S-001410101000000E1010B0008B41+R-IN02+C-020000000000000006000300000000000000010008000000000000000600",
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
        "mainName": "Inequality",
        "subName": "ax²+bx+c>0",
        "mainMode": "4B",
        "subMode": "0400"
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
        "equation",
        "result"
      ],
      "equation": {
        "latex": "-2x^2 +3x -8 >0",
        "decimal": [
          "-2",
          "3",
          "-8"
        ],
        "element": [
          [
            "-2",
            "3",
            "-8"
          ]
        ]
      },
      "result": [
        {
          "name": "templated",
          "latex": "No Solution"
        }
      ]
    }
  },
  {
    "name": "Inequality sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-4B04DD0000+S-001410101000000E1010B0008B41+R-IN0B8001030400730104060680010304007301040601+C-020000000000000001000300000000000000010008000000000000000600",
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
        "mainName": "Inequality",
        "subName": "ax²+bx+c>0",
        "mainMode": "4B",
        "subMode": "0400"
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
        "equation",
        "result"
      ],
      "equation": {
        "latex": "2x^2 +3x -8 >0",
        "decimal": [
          "2",
          "3",
          "-8"
        ],
        "element": [
          [
            "2",
            "3",
            "-8"
          ]
        ]
      },
      "result": [
        {
          "name": "templated",
          "latex": "x<- \\dfrac { \\displaystyle  3  +  \\sqrt{73}  } {\\displaystyle 4},  \\dfrac { \\displaystyle - 3  +  \\sqrt{73}  } {\\displaystyle 4}<x"
        },
        {
          "name": "Part1",
          "latex": "- \\dfrac { \\displaystyle  3  +  \\sqrt{73}  } {\\displaystyle 4}",
          "decimal": "-2.886000936329382792"
        },
        {
          "name": "Part2",
          "latex": " \\dfrac { \\displaystyle - 3  +  \\sqrt{73}  } {\\displaystyle 4}",
          "decimal": "1.386000936329382792"
        }
      ]
    }
  },
  {
    "name": "Inequality sample 3 (comma decimal mark)",
    "url": "http://wes.casio.com/math/index.php?q=I-251F+U-000000000000+M-4B04BD0100+S-000410101000100E1010B000B1CA+R-IN0B23A4000000000000060302000000000000000100+C-040000000000000006000500000000000000010006000000000000000100",
    "expected": {
      "model": {
        "type": "ClassWiz EX",
        "prefix": "CY",
        "id": "251",
        "name": "fx-991DE X",
        "version": "F",
        "qr": 1,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Inequality",
        "subName": "ax²+bx+c<0",
        "mainMode": "4B",
        "subMode": "0401"
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
          "code": "0"
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
          "code": "1"
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
        "latex": "-4x^2 +5x +6 <0",
        "decimal": [
          "-4",
          "5",
          "6"
        ],
        "element": [
          [
            "-4",
            "5",
            "6"
          ]
        ]
      },
      "result": [
        {
          "name": "templated",
          "latex": "x<- \\dfrac {\\displaystyle 3} {\\displaystyle 4}; 2<x"
        },
        {
          "name": "Part1",
          "latex": "- \\dfrac {\\displaystyle 3} {\\displaystyle 4}",
          "decimal": "-0.75"
        },
        {
          "name": "Part2",
          "latex": "2",
          "decimal": "2"
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

const inequalityPolynomials = {
  positiveQuadratic: { coefficients: [1, 0, 1], roots: [], positiveDefinite: true },
  square: { coefficients: [1, 0, 0], roots: [0, 0] },
  cubicTriple: { coefficients: [1, 0, 0, 0], roots: [0, 0, 0] },
  quadraticTwo: { coefficients: [1, 0, -1], roots: [-1, 1] },
  cubicLeftDouble: { coefficients: [1, 1, -1, -1], roots: [-1, -1, 1] },
  cubicRightDouble: { coefficients: [1, -1, -1, 1], roots: [-1, 1, 1] },
  cubicThree: { coefficients: [1, 0, -1, 0], roots: [-1, 0, 1] },
  quarticDoublePair: { coefficients: [1, 0, -2, 0, 1], roots: [-1, -1, 1, 1] },
  quarticLeftDouble: { coefficients: [1, 4, 3, -4, -4], roots: [-2, -2, -1, 1] },
  quarticMiddleDouble: { coefficients: [1, 0, -1, 0, 0], roots: [-1, 0, 0, 1] },
  quarticRightDouble: { coefficients: [1, -4, 3, 4, -4], roots: [-1, 1, 2, 2] },
  quarticFour: { coefficients: [1, 0, -5, 0, 4], roots: [-2, -1, 1, 2] },
};

const generatedInequalityCases = [
  { code: '01', name: 'quadratic always positive', polynomial: 'positiveQuadratic', relation: '>', result: 'All Real Numbers', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B04DD0000+S-001410100000000E1010B0007EFC+R-IN01+C-010000000000000001000000000000000000000001000000000000000100' },
  { code: '02', name: 'quadratic impossible negative', polynomial: 'positiveQuadratic', relation: '<', result: 'No Solution', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B04DD0100+S-001410100000000E1010B000F063+R-IN02+C-010000000000000001000000000000000000000001000000000000000100' },
  { code: '03', name: 'quadratic zero only', polynomial: 'square', relation: '≤', result: 'x=0', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B04AD0300+S-001410100000000E1010B0009F17+R-IN0300000000000000000000+C-010000000000000001000000000000000000000000000000000000000000' },
  { code: '04', name: 'quadratic nonzero', polynomial: 'square', relation: '>', result: 'x≠0', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B04AD0000+S-001410100000000E1010B00095F8+R-IN0400000000000000000000+C-010000000000000001000000000000000000000000000000000000000000' },
  { code: '05', name: 'cubic negative half-line', polynomial: 'cubicTriple', relation: '<', result: 'x<0', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0100+S-001410100000000E1010B000C731+R-IN0500000000000000000000+C-01000000000000000100000000000000000000000000000000000000000000000000000000000000' },
  { code: '06', name: 'cubic nonpositive half-line', polynomial: 'cubicTriple', relation: '≤', result: 'x≤0', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0300+S-001410100000000E1010B000DD50+R-IN0600000000000000000000+C-01000000000000000100000000000000000000000000000000000000000000000000000000000000' },
  { code: '07', name: 'cubic positive half-line', polynomial: 'cubicTriple', relation: '>', result: '0<x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0000+S-001410100000000E1010B00000D6+R-IN0700000000000000000000+C-01000000000000000100000000000000000000000000000000000000000000000000000000000000' },
  { code: '08', name: 'cubic nonnegative half-line', polynomial: 'cubicTriple', relation: '≥', result: '0≤x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0200+S-001410100000000E1010B0008676+R-IN0800000000000000000000+C-01000000000000000100000000000000000000000000000000000000000000000000000000000000' },
  { code: '09', name: 'quadratic between roots strict', polynomial: 'quadraticTwo', relation: '<', result: '-1<x<1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B04AD0100+S-001410100000000E1010B00062DA+R-IN090100000000000000060001000000000000000100+C-010000000000000001000000000000000000000001000000000000000600' },
  { code: '0A', name: 'quadratic between roots closed', polynomial: 'quadraticTwo', relation: '≤', result: '-1≤x≤1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B04AD0300+S-001410100000000E1010B0009F17+R-IN0A0100000000000000060001000000000000000100+C-010000000000000001000000000000000000000001000000000000000600' },
  { code: '0B', name: 'quadratic outside roots strict', polynomial: 'quadraticTwo', relation: '>', result: 'x<-1, 1<x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B04AD0000+S-001410100000000E1010B00095F8+R-IN0B0100000000000000060001000000000000000100+C-010000000000000001000000000000000000000001000000000000000600' },
  { code: '0C', name: 'quadratic outside roots closed', polynomial: 'quadraticTwo', relation: '≥', result: 'x≤-1, 1≤x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B04AD0200+S-001410100000000E1010B000BEEC+R-IN0C0100000000000000060001000000000000000100+C-010000000000000001000000000000000000000001000000000000000600' },
  { code: '0D', name: 'cubic isolated root plus right ray', polynomial: 'cubicLeftDouble', relation: '≥', result: 'x=-1, 1≤x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0200+S-001410100000000E1010B0008676+R-IN0D0100000000000000060001000000000000000100+C-01000000000000000100010000000000000001000100000000000000060001000000000000000600' },
  { code: '0E', name: 'cubic punctured left ray', polynomial: 'cubicLeftDouble', relation: '<', result: 'x≠-1 \\mathrm{and} x<1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0100+S-001410100000000E1010B000C731+R-IN0E0100000000000000060001000000000000000100+C-01000000000000000100010000000000000001000100000000000000060001000000000000000600' },
  { code: '0F', name: 'cubic left ray plus isolated root', polynomial: 'cubicRightDouble', relation: '≤', result: 'x≤-1, x=1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0300+S-001410100000000E1010B000DD50+R-IN0F0100000000000000060001000000000000000100+C-01000000000000000100010000000000000006000100000000000000060001000000000000000100' },
  { code: '10', name: 'cubic punctured right ray', polynomial: 'cubicRightDouble', relation: '>', result: '-1<x \\mathrm{and} x ≠1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0000+S-001410100000000E1010B00000D6+R-IN100100000000000000060001000000000000000100+C-01000000000000000100010000000000000006000100000000000000060001000000000000000100' },
  { code: '11', name: 'cubic positive alternating intervals', polynomial: 'cubicThree', relation: '>', result: '-1<x<0, 1<x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0000+S-001410100000000E1010B00000D6+R-IN11010000000000000006000000000000000000000001000000000000000100+C-01000000000000000100000000000000000000000100000000000000060000000000000000000000' },
  { code: '12', name: 'cubic nonnegative alternating intervals', polynomial: 'cubicThree', relation: '≥', result: '-1≤x≤0, 1≤x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0200+S-001410100000000E1010B0008676+R-IN12010000000000000006000000000000000000000001000000000000000100+C-01000000000000000100000000000000000000000100000000000000060000000000000000000000' },
  { code: '13', name: 'cubic negative alternating intervals', polynomial: 'cubicThree', relation: '<', result: 'x<-1, 0<x<1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0100+S-001410100000000E1010B000C731+R-IN13010000000000000006000000000000000000000001000000000000000100+C-01000000000000000100000000000000000000000100000000000000060000000000000000000000' },
  { code: '14', name: 'cubic nonpositive alternating intervals', polynomial: 'cubicThree', relation: '≤', result: 'x≤-1, 0≤x≤1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B05AD0300+S-001410100000000E1010B000DD50+R-IN14010000000000000006000000000000000000000001000000000000000100+C-01000000000000000100000000000000000000000100000000000000060000000000000000000000' },
  { code: '15', name: 'quartic excludes two double roots', polynomial: 'quarticDoublePair', relation: '>', result: 'x≠-1 \\mathrm{and} x≠1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0000+S-001410100000000E1010B000DEA8+R-IN150100000000000000060001000000000000000100+C-0100000000000000010000000000000000000000020000000000000006000000000000000000000001000000000000000100' },
  { code: '16', name: 'quartic only two double roots', polynomial: 'quarticDoublePair', relation: '≤', result: 'x=-1, x=1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0300+S-001410100000000E1010B000B81B+R-IN160100000000000000060001000000000000000100+C-0100000000000000010000000000000000000000020000000000000006000000000000000000000001000000000000000100' },
  { code: '17', name: 'quartic left double root outside solution', polynomial: 'quarticLeftDouble', relation: '>', result: 'x≠-2 \\mathrm{and} x<-1, 1<x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0000+S-001410100000000E1010B000DEA8+R-IN17020000000000000006000100000000000000060001000000000000000100+C-0100000000000000010004000000000000000100030000000000000001000400000000000000060004000000000000000600' },
  { code: '18', name: 'quartic left isolated root plus closed interval', polynomial: 'quarticLeftDouble', relation: '≤', result: 'x=-2, -1≤x≤1', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0300+S-001410100000000E1010B000B81B+R-IN18020000000000000006000100000000000000060001000000000000000100+C-0100000000000000010004000000000000000100030000000000000001000400000000000000060004000000000000000600' },
  { code: '19', name: 'quartic middle double root punctured interval', polynomial: 'quarticMiddleDouble', relation: '<', result: '-1<x<1 \\mathrm{and} x≠0', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0100+S-001410100000000E1010B000BB55+R-IN19010000000000000006000000000000000000000001000000000000000100+C-0100000000000000010000000000000000000000010000000000000006000000000000000000000000000000000000000000' },
  { code: '1A', name: 'quartic middle isolated root plus outer rays', polynomial: 'quarticMiddleDouble', relation: '≥', result: 'x≤-1, x=0, 1≤x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0200+S-001410100000000E1010B00048B5+R-IN1A010000000000000006000000000000000000000001000000000000000100+C-0100000000000000010000000000000000000000010000000000000006000000000000000000000000000000000000000000' },
  { code: '1B', name: 'quartic right double root outside solution', polynomial: 'quarticRightDouble', relation: '>', result: 'x<-1, 1<x, \\mathrm{and} x≠2', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0000+S-001410100000000E1010B000DEA8+R-IN1B010000000000000006000100000000000000010002000000000000000100+C-0100000000000000010004000000000000000600030000000000000001000400000000000000010004000000000000000600' },
  { code: '1C', name: 'quartic closed interval plus right isolated root', polynomial: 'quarticRightDouble', relation: '≤', result: '-1≤x≤1, x=2', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0300+S-001410100000000E1010B000B81B+R-IN1C010000000000000006000100000000000000010002000000000000000100+C-0100000000000000010004000000000000000600030000000000000001000400000000000000010004000000000000000600' },
  { code: '1D', name: 'quartic two strict inner intervals', polynomial: 'quarticFour', relation: '<', result: '-2<x<-1, 1<x<2', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0100+S-001410100000000E1010B000BB55+R-IN1D02000000000000000600010000000000000006000100000000000000010002000000000000000100+C-0100000000000000010000000000000000000000050000000000000006000000000000000000000004000000000000000100' },
  { code: '1E', name: 'quartic three strict positive intervals', polynomial: 'quarticFour', relation: '>', result: 'x<-2, -1<x<1, 2<x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0000+S-001410100000000E1010B000DEA8+R-IN1E02000000000000000600010000000000000006000100000000000000010002000000000000000100+C-0100000000000000010000000000000000000000050000000000000006000000000000000000000004000000000000000100' },
  { code: '1F', name: 'quartic two closed inner intervals', polynomial: 'quarticFour', relation: '≤', result: '-2≤x≤-1, 1≤x≤2', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0300+S-001410100000000E1010B000B81B+R-IN1F02000000000000000600010000000000000006000100000000000000010002000000000000000100+C-0100000000000000010000000000000000000000050000000000000006000000000000000000000004000000000000000100' },
  { code: '20', name: 'quartic three closed positive intervals', polynomial: 'quarticFour', relation: '≥', result: 'x≤-2, -1≤x≤1, 2≤x', url: 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-4B06AD0200+S-001410100000000E1010B00048B5+R-IN2002000000000000000600010000000000000006000100000000000000010002000000000000000100+C-0100000000000000010000000000000000000000050000000000000006000000000000000000000004000000000000000100' },
];

const solutionContains = {
  '01': () => true, '02': () => false, '03': x => x === 0, '04': x => x !== 0,
  '05': x => x < 0, '06': x => x <= 0, '07': x => 0 < x, '08': x => 0 <= x,
  '09': x => -1 < x && x < 1, '0A': x => -1 <= x && x <= 1,
  '0B': x => x < -1 || 1 < x, '0C': x => x <= -1 || 1 <= x,
  '0D': x => x === -1 || 1 <= x, '0E': x => x !== -1 && x < 1,
  '0F': x => x <= -1 || x === 1, '10': x => -1 < x && x !== 1,
  '11': x => (-1 < x && x < 0) || 1 < x, '12': x => (-1 <= x && x <= 0) || 1 <= x,
  '13': x => x < -1 || (0 < x && x < 1), '14': x => x <= -1 || (0 <= x && x <= 1),
  '15': x => x !== -1 && x !== 1, '16': x => x === -1 || x === 1,
  '17': x => (x !== -2 && x < -1) || 1 < x, '18': x => x === -2 || (-1 <= x && x <= 1),
  '19': x => -1 < x && x < 1 && x !== 0, '1A': x => x <= -1 || x === 0 || 1 <= x,
  '1B': x => x < -1 || (1 < x && x !== 2), '1C': x => (-1 <= x && x <= 1) || x === 2,
  '1D': x => (-2 < x && x < -1) || (1 < x && x < 2),
  '1E': x => x < -2 || (-1 < x && x < 1) || 2 < x,
  '1F': x => (-2 <= x && x <= -1) || (1 <= x && x <= 2),
  '20': x => x <= -2 || (-1 <= x && x <= 1) || 2 <= x,
};

const relationHolds = {
  '>': value => value > 0, '<': value => value < 0,
  '≥': value => value >= 0, '≤': value => value <= 0,
};

const expandMonicRoots = roots => roots.reduce((coefficients, root) => {
  const expanded = Array(coefficients.length + 1).fill(0);
  coefficients.forEach((coefficient, index) => {
    expanded[index] += coefficient;
    expanded[index + 1] -= coefficient * root;
  });
  return expanded;
}, [1]);

const evaluatePolynomial = (coefficients, x) =>
  coefficients.reduce((value, coefficient) => value * x + coefficient, 0);

const formatPolynomial = coefficients => {
  const degree = coefficients.length - 1;
  const terms = [];
  coefficients.forEach((coefficient, index) => {
    if (coefficient === 0) return;
    const exponent = degree - index;
    const variable = exponent === 0 ? '' : exponent === 1 ? 'x' : 'x^' + exponent;
    const magnitude = Math.abs(coefficient) === 1 && exponent > 0 ? '' : Math.abs(coefficient);
    const sign = terms.length === 0 ? (coefficient < 0 ? '-' : '') : coefficient < 0 ? '-' : '+';
    terms.push(sign + magnitude + variable);
  });
  return terms.join(' ');
};

for (const { code, name, polynomial, relation, result, url } of generatedInequalityCases) {
  test('Generated inequality QR IN' + code + ': ' + name, () => {
    const definition = inequalityPolynomials[polynomial];
    const parsed = parse(url);
    const degree = definition.coefficients.length - 1;
    const relationCode = { '>': '00', '<': '01', '≥': '02', '≤': '03' }[relation];

    assert.equal(parsed.mode.subMode, String(degree + 2).padStart(2, '0') + relationCode);
    assert.equal(parsed.equation.latex, formatPolynomial(definition.coefficients) + ' ' + relation + '0');
    assert.deepEqual(parsed.equation.decimal.map(String), definition.coefficients.map(String));
    assert.equal(parsed.result[0].latex, result);

    if (definition.positiveDefinite) {
      const [a, b, c] = definition.coefficients;
      assert.ok(a > 0 && b * b - 4 * a * c < 0);
    } else {
      assert.deepEqual(expandMonicRoots(definition.roots), definition.coefficients);
    }

    const distinctRoots = [...new Set(definition.roots)].sort((a, b) => a - b);
    const probes = distinctRoots.length === 0 ? [-10, -1, 0, 1, 10] : [
      distinctRoots[0] - 1,
      ...distinctRoots.flatMap((root, index) => [
        root,
        ...(index + 1 < distinctRoots.length ? [(root + distinctRoots[index + 1]) / 2] : []),
      ]),
      distinctRoots.at(-1) + 1,
    ];

    // The sign is constant between adjacent real roots; these probes form the complete sign chart.
    for (const x of probes) {
      assert.equal(
        relationHolds[relation](evaluatePolynomial(definition.coefficients, x)),
        solutionContains[code](x),
        'sign chart mismatch for IN' + code + ' at x=' + x,
      );
    }
  });
}

const localizationCases = [
  {
    "name": "Inequality localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-4B04DD0000+S-001410101000000E1010B0008B41+R-IN02+C-020000000000000006000300000000000000010008000000000000000600",
    "fields": [
      "equation",
      "result"
    ],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Inequality",
          "subName": "ax²+bx+c>0",
          "mainMode": "4B",
          "subMode": "0400"
        },
        "format": {
          "displayName": "Standard",
          "storeName": "Standard",
          "displayCode": "D",
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
          "latex": "-2x^2 +3x -8 >0",
          "decimal": [
            "-2",
            "3",
            "-8"
          ],
          "element": [
            [
              "-2",
              "3",
              "-8"
            ]
          ]
        },
        "result": [
          {
            "name": "templated",
            "latex": "No Solution"
          }
        ]
      },
      "zh": {
        "mode": {
          "mainName": "不等式",
          "subName": "ax²+bx+c>0",
          "mainMode": "4B",
          "subMode": "0400"
        },
        "format": {
          "displayName": "标准",
          "storeName": "标准",
          "displayCode": "D",
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
          "latex": "-2x^2 +3x -8 >0",
          "decimal": [
            "-2",
            "3",
            "-8"
          ],
          "element": [
            [
              "-2",
              "3",
              "-8"
            ]
          ]
        },
        "result": [
          {
            "name": "templated",
            "latex": "无解"
          }
        ]
      },
      "vi": {
        "mode": {
          "mainName": "Bất phương trình",
          "subName": "ax²+bx+c>0",
          "mainMode": "4B",
          "subMode": "0400"
        },
        "format": {
          "displayName": "Standard",
          "storeName": "Standard",
          "displayCode": "D",
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
          "latex": "-2x^2 +3x -8 >0",
          "decimal": [
            "-2",
            "3",
            "-8"
          ],
          "element": [
            [
              "-2",
              "3",
              "-8"
            ]
          ]
        },
        "result": [
          {
            "name": "templated",
            "latex": "Vô nghiệm"
          }
        ]
      },
      "fr": {
        "mode": {
          "mainName": "Inégalité",
          "subName": "ax²+bx+c>0",
          "mainMode": "4B",
          "subMode": "0400"
        },
        "format": {
          "displayName": "Standard",
          "storeName": "Standard",
          "displayCode": "D",
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
          "latex": "-2x^2 +3x -8 >0",
          "decimal": [
            "-2",
            "3",
            "-8"
          ],
          "element": [
            [
              "-2",
              "3",
              "-8"
            ]
          ]
        },
        "result": [
          {
            "name": "templated",
            "latex": "Aucune solution"
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
