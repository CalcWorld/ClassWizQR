import assert from 'node:assert/strict';
import { test } from 'vitest';

import { parse, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/MathBox-Mode.md
const cases = [
  {
    "name": "MathBox sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-4F00S10000+S-001410101000000E1010B0000455+C-030000000000000001000250000000000000010200000000000000000000+T-3400349C0034CG0034IO00344M00359200357G0035A000356S0035BI00357Q00355K00354C0035420035680034FK0034",
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
        "mainName": "Math Box",
        "subName": "Dice Roll",
        "mainMode": "4F",
        "subMode": "S1"
      },
      "format": {
        "displayName": "Not Specified",
        "storeName": "Not Specified",
        "displayCode": "0",
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
        "mathBox"
      ],
      "mathBox": {
        "quantity": "3",
        "attempts": "250",
        "array": [
          [
            "Sum",
            "Freq",
            "Rel Fr"
          ],
          [
            "3",
            "1",
            "0.004"
          ],
          [
            "4",
            "3",
            "0.012"
          ],
          [
            "5",
            "4",
            "0.016"
          ],
          [
            "6",
            "6",
            "0.024"
          ],
          [
            "7",
            "15",
            "0.06"
          ],
          [
            "8",
            "29",
            "0.116"
          ],
          [
            "9",
            "24",
            "0.096"
          ],
          [
            "10",
            "32",
            "0.128"
          ],
          [
            "11",
            "22",
            "0.088"
          ],
          [
            "12",
            "37",
            "0.148"
          ],
          [
            "13",
            "25",
            "0.1"
          ],
          [
            "14",
            "18",
            "0.072"
          ],
          [
            "15",
            "14",
            "0.056"
          ],
          [
            "16",
            "13",
            "0.052"
          ],
          [
            "17",
            "2",
            "0.008"
          ],
          [
            "18",
            "5",
            "0.02"
          ]
        ],
        "csv": "Sum,Freq,Rel Fr\n3,1,0.004\n4,3,0.012\n5,4,0.016\n6,6,0.024\n7,15,0.06\n8,29,0.116\n9,24,0.096\n10,32,0.128\n11,22,0.088\n12,37,0.148\n13,25,0.1\n14,18,0.072\n15,14,0.056\n16,13,0.052\n17,2,0.008\n18,5,0.02"
      }
    }
  }
];

for (const { name, url, expected } of cases) {
  test(name, () => {
    assert.deepEqual(projectResult(parse(url)), expected);
  });
}
