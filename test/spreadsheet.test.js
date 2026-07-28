import assert from 'node:assert/strict';
import { test } from 'vitest';

import { parse, projectLocalization, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Spreadsheet-Mode.md
const cases = [
  {
    "name": "Spreadsheet sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0D00000000+S-001410101000000E1010B0002896+T-SPE00000000000800000000000000000000000000000000000000000000000F20000000F30000000333333099100000100",
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
        "mainName": "Spreadsheet",
        "mainMode": "0D",
        "subMode": "00"
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
        "spreadsheet"
      ],
      "spreadsheet": {
        "array": [
          [
            "Syntax ERROR",
            "1",
            null,
            null,
            null
          ],
          [
            "Math ERROR",
            null,
            null,
            null,
            null
          ],
          [
            "0.333333",
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ],
          [
            null,
            null,
            null,
            null,
            null
          ]
        ],
        "csv": "Syntax ERROR,1,,,\nMath ERROR,,,,\n0.333333,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,"
      }
    }
  },
  {
    "name": "Spreadsheet sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0D00A00000+S-001410101000000E1010B0006AC1+T-SPFFFFFFFFFFF8FFFFFFFFFFF8FFFFFFFFFFF8FFFFFFFFE000000000000000944000099728000099417000099210000099384000099775000099333000099945000099693000099658000099713000099183000099110000099533000099907000099948000099705000099234000099253000099315000099243000099442000099260000098477000099523000099607000099784000099703000099801000099711000099854000099525000099783000099721000099159000099205000099805000099515000099118000099919000099381000099334000099714000099170000098948000099796000099978000099657000099660000099170000098638000099961000099670000099780000099781000099153000099647000099930000099752000099115000099265000099833000099890000098680000098301000099970000099989000099585000099612000099325000099998000099950000099702000099106000099540000099371000099199000099295000099645000099606000099882000099592000099946000099585000099335000099940000099446000099894000099200000097101000099559000099646000099303000099227000099461000099113000099649000099280000098749000099306000099892000099408000099972000099110000099689000099582000099913000099181000099394000099288000099391000099868000099849000099420000099895000099893000099829000099180000099522000099960000099758000099820000098690000099709000099292000099777000099842000099806000099225000099347000099623000099328000099505000099924000099706000099970000098941000099529000099594000099799000099357000099153000099249000099940000099716000099479000099411000099311000099751000099136000099576000099507000099782000099662000099496000099270000098845000099971000099572000099672000099290000099881000099132000099712000099349000099810000099940000098405000099321000099965000099",
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
        "mainName": "Spreadsheet",
        "mainMode": "0D",
        "subMode": "00"
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
        "spreadsheet"
      ],
      "spreadsheet": {
        "array": [
          [
            "0.944",
            "0.796",
            "0.559",
            "0.097",
            null
          ],
          [
            "0.728",
            "0.978",
            "0.646",
            "0.941",
            null
          ],
          [
            "0.417",
            "0.657",
            "0.303",
            "0.529",
            null
          ],
          [
            "0.21",
            "0.66",
            "0.227",
            "0.594",
            null
          ],
          [
            "0.384",
            "0.017",
            "0.461",
            "0.799",
            null
          ],
          [
            "0.775",
            "0.638",
            "0.113",
            "0.357",
            null
          ],
          [
            "0.333",
            "0.961",
            "0.649",
            "0.153",
            null
          ],
          [
            "0.945",
            "0.67",
            "0.028",
            "0.249",
            null
          ],
          [
            "0.693",
            "0.78",
            "0.749",
            "0.94",
            null
          ],
          [
            "0.658",
            "0.781",
            "0.306",
            "0.716",
            null
          ],
          [
            "0.713",
            "0.153",
            "0.892",
            "0.479",
            null
          ],
          [
            "0.183",
            "0.647",
            "0.408",
            "0.411",
            null
          ],
          [
            "0.11",
            "0.93",
            "0.972",
            "0.311",
            null
          ],
          [
            "0.533",
            "0.752",
            "0.11",
            "0.751",
            null
          ],
          [
            "0.907",
            "0.115",
            "0.689",
            "0.136",
            null
          ],
          [
            "0.948",
            "0.265",
            "0.582",
            "0.576",
            null
          ],
          [
            "0.705",
            "0.833",
            "0.913",
            "0.507",
            null
          ],
          [
            "0.234",
            "0.089",
            "0.181",
            "0.782",
            null
          ],
          [
            "0.253",
            "0.068",
            "0.394",
            "0.662",
            null
          ],
          [
            "0.315",
            "0.301",
            "0.288",
            "0.496",
            null
          ],
          [
            "0.243",
            "0.97",
            "0.391",
            "0.027",
            null
          ],
          [
            "0.442",
            "0.989",
            "0.868",
            "0.845",
            null
          ],
          [
            "0.026",
            "0.585",
            "0.849",
            "0.971",
            null
          ],
          [
            "0.477",
            "0.612",
            "0.42",
            "0.572",
            null
          ],
          [
            "0.523",
            "0.325",
            "0.895",
            "0.672",
            null
          ],
          [
            "0.607",
            "0.998",
            "0.893",
            "0.29",
            null
          ],
          [
            "0.784",
            "0.95",
            "0.829",
            "0.881",
            null
          ],
          [
            "0.703",
            "0.702",
            "0.18",
            "0.132",
            null
          ],
          [
            "0.801",
            "0.106",
            "0.522",
            "0.712",
            null
          ],
          [
            "0.711",
            "0.54",
            "0.96",
            "0.349",
            null
          ],
          [
            "0.854",
            "0.371",
            "0.758",
            "0.81",
            null
          ],
          [
            "0.525",
            "0.199",
            "0.082",
            "0.094",
            null
          ],
          [
            "0.783",
            "0.295",
            "0.69",
            "0.405",
            null
          ],
          [
            "0.721",
            "0.645",
            "0.709",
            "0.321",
            null
          ],
          [
            "0.159",
            "0.606",
            "0.292",
            "0.965",
            null
          ],
          [
            "0.205",
            "0.882",
            "0.777",
            null,
            null
          ],
          [
            "0.805",
            "0.592",
            "0.842",
            null,
            null
          ],
          [
            "0.515",
            "0.946",
            "0.806",
            null,
            null
          ],
          [
            "0.118",
            "0.585",
            "0.225",
            null,
            null
          ],
          [
            "0.919",
            "0.335",
            "0.347",
            null,
            null
          ],
          [
            "0.381",
            "0.94",
            "0.623",
            null,
            null
          ],
          [
            "0.334",
            "0.446",
            "0.328",
            null,
            null
          ],
          [
            "0.714",
            "0.894",
            "0.505",
            null,
            null
          ],
          [
            "0.017",
            "0.002",
            "0.924",
            null,
            null
          ],
          [
            "0.948",
            "0.101",
            "0.706",
            null,
            null
          ]
        ],
        "csv": "0.944,0.796,0.559,0.097,\n0.728,0.978,0.646,0.941,\n0.417,0.657,0.303,0.529,\n0.21,0.66,0.227,0.594,\n0.384,0.017,0.461,0.799,\n0.775,0.638,0.113,0.357,\n0.333,0.961,0.649,0.153,\n0.945,0.67,0.028,0.249,\n0.693,0.78,0.749,0.94,\n0.658,0.781,0.306,0.716,\n0.713,0.153,0.892,0.479,\n0.183,0.647,0.408,0.411,\n0.11,0.93,0.972,0.311,\n0.533,0.752,0.11,0.751,\n0.907,0.115,0.689,0.136,\n0.948,0.265,0.582,0.576,\n0.705,0.833,0.913,0.507,\n0.234,0.089,0.181,0.782,\n0.253,0.068,0.394,0.662,\n0.315,0.301,0.288,0.496,\n0.243,0.97,0.391,0.027,\n0.442,0.989,0.868,0.845,\n0.026,0.585,0.849,0.971,\n0.477,0.612,0.42,0.572,\n0.523,0.325,0.895,0.672,\n0.607,0.998,0.893,0.29,\n0.784,0.95,0.829,0.881,\n0.703,0.702,0.18,0.132,\n0.801,0.106,0.522,0.712,\n0.711,0.54,0.96,0.349,\n0.854,0.371,0.758,0.81,\n0.525,0.199,0.082,0.094,\n0.783,0.295,0.69,0.405,\n0.721,0.645,0.709,0.321,\n0.159,0.606,0.292,0.965,\n0.205,0.882,0.777,,\n0.805,0.592,0.842,,\n0.515,0.946,0.806,,\n0.118,0.585,0.225,,\n0.919,0.335,0.347,,\n0.381,0.94,0.623,,\n0.334,0.446,0.328,,\n0.714,0.894,0.505,,\n0.017,0.002,0.924,,\n0.948,0.101,0.706,,"
      }
    }
  }
];

for (const { name, url, expected } of cases) {
  test(name, () => {
    assert.deepEqual(projectResult(parse(url)), expected);
  });
}

const localizationCases = [
  {
    "name": "Spreadsheet error localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0D00000000+S-001410101000000E1010B0002896+T-SPE00000000000800000000000000000000000000000000000000000000000F20000000F30000000333333099100000100",
    "fields": [
      "spreadsheet"
    ],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Spreadsheet",
          "mainMode": "0D",
          "subMode": "00"
        },
        "format": {
          "displayName": "Not Specified",
          "storeName": "Not Specified",
          "displayCode": "0",
          "storeCode": "0"
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
        ],
        "spreadsheet": {
          "array": [
            [
              "Syntax ERROR",
              "1",
              null,
              null,
              null
            ],
            [
              "Math ERROR",
              null,
              null,
              null,
              null
            ],
            [
              "0.333333",
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ]
          ],
          "csv": "Syntax ERROR,1,,,\nMath ERROR,,,,\n0.333333,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,"
        }
      },
      "zh": {
        "mode": {
          "mainName": "数据表格",
          "mainMode": "0D",
          "subMode": "00"
        },
        "format": {
          "displayName": "未指定",
          "storeName": "未指定",
          "displayCode": "0",
          "storeCode": "0"
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
        ],
        "spreadsheet": {
          "array": [
            [
              "语法错误",
              "1",
              null,
              null,
              null
            ],
            [
              "数学错误",
              null,
              null,
              null,
              null
            ],
            [
              "0.333333",
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ]
          ],
          "csv": "语法错误,1,,,\n数学错误,,,,\n0.333333,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,"
        }
      },
      "vi": {
        "mode": {
          "mainName": "Bảng tính",
          "mainMode": "0D",
          "subMode": "00"
        },
        "format": {
          "displayName": "Không chỉ định",
          "storeName": "Không chỉ định",
          "displayCode": "0",
          "storeCode": "0"
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
        ],
        "spreadsheet": {
          "array": [
            [
              "Lỗi cú pháp",
              "1",
              null,
              null,
              null
            ],
            [
              "Lỗi phép tính",
              null,
              null,
              null,
              null
            ],
            [
              "0.333333",
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ]
          ],
          "csv": "Lỗi cú pháp,1,,,\nLỗi phép tính,,,,\n0.333333,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,"
        }
      },
      "fr": {
        "mode": {
          "mainName": "Tableur",
          "mainMode": "0D",
          "subMode": "00"
        },
        "format": {
          "displayName": "Non spécifié",
          "storeName": "Non spécifié",
          "displayCode": "0",
          "storeCode": "0"
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
        ],
        "spreadsheet": {
          "array": [
            [
              "ERREUR de syntaxe",
              "1",
              null,
              null,
              null
            ],
            [
              "ERREUR maths",
              null,
              null,
              null,
              null
            ],
            [
              "0.333333",
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null
            ]
          ],
          "csv": "ERREUR de syntaxe,1,,,\nERREUR maths,,,,\n0.333333,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,"
        }
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
