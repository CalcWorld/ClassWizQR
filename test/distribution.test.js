import assert from 'node:assert/strict';
import { test } from 'vitest';

import { assertSetupUnorderedEqual, parse, projectLocalization, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Distribution-Mode.md
const cases = [
  {
    "name": "Distribution sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C04A00000+S-001410101000000E1010B0003D24+C-0300000000000000010001428571428571420099+T-100000100314868099200000100524781098300000100291545097",
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
        "mainName": "Distribution",
        "subName": "Binomial Probability",
        "mainMode": "0C",
        "subMode": "04"
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
        "statistic",
        "distribution"
      ],
      "statistic": {
        "array": [
          [
            "x",
            "P"
          ],
          [
            "1",
            "0.314868"
          ],
          [
            "2",
            "0.0524781"
          ],
          [
            "3",
            "0.00291545"
          ]
        ],
        "csv": "x,P\n1,0.314868\n2,0.0524781\n3,0.00291545"
      },
      "distribution": {
        "latex": "N=3 \\\\ p= \\dfrac {\\displaystyle 1} {\\displaystyle 7}",
        "decimal": [
          "3",
          "0.142857142857142"
        ]
      }
    }
  },
  {
    "name": "Distribution sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C0300A000+S-001410101000000E1010B00092B8+R-0436896723038129009800000000000000000000+C-010000000000000000990300000000000000009902000000000000000099",
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
        "mainName": "Distribution",
        "subName": "Inverse Normal Cumulative Distribution",
        "mainMode": "0C",
        "subMode": "03"
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
        "result",
        "distribution"
      ],
      "result": [
        {
          "name": "templated",
          "latex": "0.0436896723038129"
        },
        {
          "name": "Part1",
          "latex": "0.0436896723038129",
          "decimal": "0.0436896723038129"
        },
        {
          "name": "Part2",
          "latex": "0",
          "decimal": "0"
        }
      ],
      "distribution": {
        "latex": "Area= \\dfrac {\\displaystyle 1} {\\displaystyle 10} \\\\ μ= \\dfrac {\\displaystyle 3} {\\displaystyle 10} \\\\ σ= \\dfrac {\\displaystyle 1} {\\displaystyle 5}",
        "decimal": [
          "0.1",
          "0.3",
          "0.2"
        ]
      }
    }
  }
];

for (const { name, url, expected } of cases) {
  test(name, () => {
    assertSetupUnorderedEqual(projectResult(parse(url)), expected);
  });
}

const localizationCases = [
  {
    "name": "Distribution localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C0300A000+S-001410101000000E1010B00092B8+R-0436896723038129009800000000000000000000+C-010000000000000000990300000000000000009902000000000000000099",
    "fields": [
      "distribution"
    ],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Distribution",
          "subName": "Inverse Normal Cumulative Distribution",
          "mainMode": "0C",
          "subMode": "03"
        },
        "format": {
          "displayName": "Decimal",
          "storeName": "Not Specified",
          "displayCode": "A",
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
        "distribution": {
          "latex": "Area= \\dfrac {\\displaystyle 1} {\\displaystyle 10} \\\\ μ= \\dfrac {\\displaystyle 3} {\\displaystyle 10} \\\\ σ= \\dfrac {\\displaystyle 1} {\\displaystyle 5}",
          "decimal": [
            "0.1",
            "0.3",
            "0.2"
          ]
        }
      },
      "zh": {
        "mode": {
          "mainName": "分布",
          "subName": "反正态累积分布",
          "mainMode": "0C",
          "subMode": "03"
        },
        "format": {
          "displayName": "小数",
          "storeName": "未指定",
          "displayCode": "A",
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
        "distribution": {
          "latex": "区域= \\dfrac {\\displaystyle 1} {\\displaystyle 10} \\\\ μ= \\dfrac {\\displaystyle 3} {\\displaystyle 10} \\\\ σ= \\dfrac {\\displaystyle 1} {\\displaystyle 5}",
          "decimal": [
            "0.1",
            "0.3",
            "0.2"
          ]
        }
      },
      "vi": {
        "mode": {
          "mainName": "Phân phối",
          "subName": "Phân phối tích lũy chuẩn nghịch đảo",
          "mainMode": "0C",
          "subMode": "03"
        },
        "format": {
          "displayName": "Thập phân",
          "storeName": "Không chỉ định",
          "displayCode": "A",
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
        "distribution": {
          "latex": "Vùng= \\dfrac {\\displaystyle 1} {\\displaystyle 10} \\\\ μ= \\dfrac {\\displaystyle 3} {\\displaystyle 10} \\\\ σ= \\dfrac {\\displaystyle 1} {\\displaystyle 5}",
          "decimal": [
            "0.1",
            "0.3",
            "0.2"
          ]
        }
      },
      "fr": {
        "mode": {
          "mainName": "Probabilités",
          "subName": "Inverse normale",
          "mainMode": "0C",
          "subMode": "03"
        },
        "format": {
          "displayName": "Décimal",
          "storeName": "Non spécifié",
          "displayCode": "A",
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
        "distribution": {
          "latex": "Aire= \\dfrac {\\displaystyle 1} {\\displaystyle 10} \\\\ μ= \\dfrac {\\displaystyle 3} {\\displaystyle 10} \\\\ σ= \\dfrac {\\displaystyle 1} {\\displaystyle 5}",
          "decimal": [
            "0.1",
            "0.3",
            "0.2"
          ]
        }
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

// Source: https://support.casio.com/global/en/calc/manual/fx-9910CW_en/using_calculator_apps/distribution_calculations.html
const combination = (n, k) => {
  let result = 1;
  for (let i = 1; i <= k; i++) result = result * (n - i + 1) / i;
  return result;
};

const binomialPd = (x, n, p) => combination(n, x) * p ** x * (1 - p) ** (n - x);
const binomialCd = (x, n, p) => Array.from(
  { length: x + 1 },
  (_, value) => binomialPd(value, n, p),
).reduce((sum, value) => sum + value, 0);
const poissonPd = (x, lambda) => Math.exp(-lambda) * lambda ** x
  / Array.from({ length: x }, (_, index) => index + 1).reduce((product, value) => product * value, 1);
const poissonCd = (x, lambda) => Array.from(
  { length: x + 1 },
  (_, value) => poissonPd(value, lambda),
).reduce((sum, value) => sum + value, 0);

const distributionVariableCases = [
  {
    name: 'Distribution FY-505 Normal PD Variable',
    url: 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C0100A000+S-001410101000000E1010B0008276+R-0176032663382149009900000000000000000000+C-036000000000000001010350000000000000010102000000000000000100',
    subMode: '01',
    parameters: [36, 35, 2],
    expected: Math.exp(-0.5 * ((36 - 35) / 2) ** 2) / (2 * Math.sqrt(2 * Math.PI)),
  },
  {
    name: 'Distribution FY-505 Normal CD Variable',
    url: 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C0200A000+S-001410101000000E1010B000B8C7+R-0341344746068229009900000000000000000000+C-00000000000000000000010000000000000001000000000000000000000001000000000000000100',
    subMode: '02',
    parameters: [0, 1, 0, 1],
    expected: 0.3413447460685429,
  },
  {
    name: 'Distribution FY-505 Binomial PD Variable',
    url: 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C0400A000+S-001410101000000E1010B0008E4C+R-0312500000000000009900000000000000000000+C-020000000000000001000500000000000000010005000000000000000099',
    subMode: '04',
    parameters: [2, 5, 0.5],
    expected: binomialPd(2, 5, 0.5),
  },
  {
    name: 'Distribution FY-505 Binomial CD Variable',
    url: 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C0500A000+S-001410101000000E1010B000D401+R-0499999999999999009900000000000000000000+C-020000000000000001000500000000000000010005000000000000000099',
    subMode: '05',
    parameters: [2, 5, 0.5],
    expected: binomialCd(2, 5, 0.5),
  },
  {
    name: 'Distribution FY-505 Poisson PD Variable',
    url: 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C0600A000+S-001410101000000E1010B0000385+R-0224041807655387009900000000000000000000+C-0200000000000000010003000000000000000100',
    subMode: '06',
    parameters: [2, 3],
    expected: poissonPd(2, 3),
  },
  {
    name: 'Distribution FY-505 Poisson CD Variable',
    url: 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C0700A000+S-001410101000000E1010B000A20D+R-0423190102774688009900000000000000000000+C-0200000000000000010003000000000000000100',
    subMode: '07',
    parameters: [2, 3],
    expected: poissonCd(2, 3),
  },
];

for (const { name, url, subMode, parameters, expected } of distributionVariableCases) {
  test(name, () => {
    const result = parse(url);

    assert.equal(result.model.id, '505');
    assert.equal(result.mode.subMode, subMode);
    assert.deepEqual(result.distribution.decimal.map(Number), parameters);
    // The calculator manual specifies distribution accuracy of up to six
    // significant digits, even when the encoded result contains more digits.
    assert.ok(Math.abs(Number(result.result[1].decimal) - expected) < 5e-7);
  });
}

const distributionListCases = [
  {
    name: 'Distribution FY-505 Binomial CD List',
    url: 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C05A00000+S-001410101000000E1010B0003FE7+C-0500000000000000010005000000000000000099+T-200000100499999099300000100812500099',
    subMode: '05',
    parameters: [5, 0.5],
    probability: x => binomialCd(x, 5, 0.5),
  },
  {
    name: 'Distribution FY-505 Poisson PD List',
    url: 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C06A00000+S-001410101000000E1010B0003962+C-03000000000000000100+T-200000100224041099300000100224041099',
    subMode: '06',
    parameters: [3],
    probability: x => poissonPd(x, 3),
  },
  {
    name: 'Distribution FY-505 Poisson CD List',
    url: 'http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0C07A00000+S-001410101000000E1010B0004932+C-03000000000000000100+T-200000100423190099300000100647231099',
    subMode: '07',
    parameters: [3],
    probability: x => poissonCd(x, 3),
  },
];

for (const { name, url, subMode, parameters, probability } of distributionListCases) {
  test(name, () => {
    const result = parse(url);

    assert.equal(result.model.id, '505');
    assert.equal(result.mode.subMode, subMode);
    assert.deepEqual(result.distribution.decimal.map(Number), parameters);
    assert.deepEqual(result.statistic.array[0], ['x', 'P']);
    for (const [x, actual] of result.statistic.array.slice(1)) {
      assert.ok(Math.abs(Number(actual) - probability(Number(x))) < 1.1e-6);
    }
  });
}
