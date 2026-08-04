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

test('Equation coefficients must contain complete 20-character chunks', () => {
  const payload = { M: '4504BD0000', S: EQUATION_SETUP };

  assert.throws(
    () => ParseEquation({ ...payload, C: '' }),
    /Equation template not match/,
  );
  assert.throws(
    () => ParseEquation({ ...payload, C: ZERO_COEFFICIENT.repeat(3) + '0' }),
    /Equation template not match/,
  );
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
