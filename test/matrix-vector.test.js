import assert from 'node:assert/strict';
import { test } from 'vitest';

import { assertSetupUnorderedEqual, parse, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Matrix,-Vector-Mode.md
const cases = [
  {
    "name": "Matrix and Vector sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-060400A047+S-001410101000000E1010B0008869+E-FB20A8FB21+R-MT2201666666666666660100016666666666666601990833333333333333009908333333333333330198+C-MA220333333333333333009921A300000000000001030166666666666666009921A60000000000000103MB2205000000000000000100050000000000000001990500000000000000000103000000000000000106",
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
        "mainName": "Matrix",
        "mainMode": "06",
        "subMode": "04"
      },
      "format": {
        "displayName": "Decimal",
        "storeName": "Not Specified",
        "displayCode": "A",
        "storeCode": "0"
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
        "result",
        "matrix"
      ],
      "expression": "\\mathrm{MatA} \\times \\mathrm{MatB}",
      "result": [
        {
          "name": "MatAns",
          "latex": "\\begin{bmatrix} \\dfrac {\\displaystyle 5} {\\displaystyle 3} & 1.66666666666666\\times 10^{99} \\\\ \\dfrac {\\displaystyle 5} {\\displaystyle 6} & 8.33333333333333\\times 10^{98} \\end{bmatrix}",
          "decimal": [
            "1.66666666666666",
            "1.66666666666666e+99",
            "0.833333333333333",
            "8.33333333333333e+98"
          ],
          "element": [
            [
              " \\dfrac {\\displaystyle 5} {\\displaystyle 3}",
              "1.66666666666666\\times 10^{99}"
            ],
            [
              " \\dfrac {\\displaystyle 5} {\\displaystyle 6}",
              "8.33333333333333\\times 10^{98}"
            ]
          ]
        }
      ],
      "matrix": [
        {
          "name": "MatA",
          "latex": "\\begin{bmatrix} \\dfrac {\\displaystyle 1} {\\displaystyle 3} &  \\dfrac {\\displaystyle 1} {\\displaystyle 3} \\\\ \\dfrac {\\displaystyle 1} {\\displaystyle 6} &  \\dfrac {\\displaystyle 1} {\\displaystyle 6} \\end{bmatrix}",
          "decimal": [
            "0.333333333333333",
            "0.33333333333333333333",
            "0.166666666666666",
            "0.16666666666666666667"
          ],
          "element": [
            [
              " \\dfrac {\\displaystyle 1} {\\displaystyle 3}",
              " \\dfrac {\\displaystyle 1} {\\displaystyle 3}"
            ],
            [
              " \\dfrac {\\displaystyle 1} {\\displaystyle 6}",
              " \\dfrac {\\displaystyle 1} {\\displaystyle 6}"
            ]
          ]
        },
        {
          "name": "MatB",
          "latex": "\\begin{bmatrix}5 & 5\\times 10^{99} \\\\5\\times 10^{-99} & 3000000 \\end{bmatrix}",
          "decimal": [
            "5",
            "5e+99",
            "5e-99",
            "3000000"
          ],
          "element": [
            [
              "5",
              "5\\times 10^{99}"
            ],
            [
              "5\\times 10^{-99}",
              "3000000"
            ]
          ]
        }
      ]
    }
  },
  {
    "name": "Matrix and Vector sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-070100A047+S-001410101000000E1010B000AC8F+Q-01900000000000000000000001010000000000000000000000000000+E-FB25ABFB26+C-VA020100000000000000010003000000000000000100VB020400000000000000010005000000000000000100",
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
        "mainName": "Vector",
        "mainMode": "07",
        "subMode": "01"
      },
      "format": {
        "displayName": "Decimal",
        "storeName": "Not Specified",
        "displayCode": "A",
        "storeCode": "0"
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
        "result",
        "vector"
      ],
      "expression": "\\mathrm{VctA} \\cdot \\mathrm{VctB}",
      "result": [
        {
          "name": "templated",
          "latex": "19"
        },
        {
          "name": "Part1",
          "latex": "19",
          "decimal": "19"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ],
      "vector": [
        {
          "name": "VctA",
          "latex": "\\begin{bmatrix}1 \\\\ 3\\end{bmatrix}",
          "decimal": [
            "1",
            "3"
          ],
          "element": [
            [
              "1",
              "3"
            ]
          ]
        },
        {
          "name": "VctB",
          "latex": "\\begin{bmatrix}4 \\\\ 5\\end{bmatrix}",
          "decimal": [
            "4",
            "5"
          ],
          "element": [
            [
              "4",
              "5"
            ]
          ]
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

test('Vector FY-523 cross product is routed to VctAns', () => {
  const url = 'http://wes.casio.com/ncal/index.php?q=I-523A+U-000000000000+M-070400A000+S-001410100000000E1010B000CEE6+R-VT03000000000000000000000000000000000000000004849639220191740599+E-FB25A8FB26+C-VA020200000000000000010002828427124746190100VB020800000000000000009928A90000000000000103';
  const parsed = parse(url);
  const [a1, a2] = parsed.vector[0].decimal.map(Number);
  const [b1, b2] = parsed.vector[1].decimal.map(Number);
  const result = parsed.result[0];

  assert.equal(parsed.model.prefix, 'FY');
  assert.equal(parsed.model.id, '523');
  assert.equal(result.name, 'VctAns');
  assert.equal(result.decimal.length, 3);
  assert.deepEqual(result.decimal.slice(0, 2).map(Number), [0, 0]);
  assert.ok(Math.abs(Number(result.decimal[2]) - (a1 * b2 - a2 * b1)) < 1e-14);
});
