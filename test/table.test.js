import { test } from 'vitest';

import { assertSetupUnorderedEqual, parse, projectLocalization, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Table-Mode.md
const cases = [
  {
    "name": "Table sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-8800000000+S-001410101000000E1010B000D334+P-100000100500000100100000100+V-400000100000000000000000000000000000000000000000000000000000000000000000+E-7747C91A321B+G-41A63647",
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
        "mainName": "Table",
        "mainMode": "88",
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
        "function",
        "tableRange",
        "variable"
      ],
      "function": [
        {
          "name": "f(x)",
          "expression": "\\sin( x ^{2} "
        },
        {
          "name": "g(x)",
          "expression": "\\mathrm{A} + 6 x"
        }
      ],
      "tableRange": [
        {
          "name": "Start",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "End",
          "latex": "5",
          "decimal": "5"
        },
        {
          "name": "Step",
          "latex": "1",
          "decimal": "1"
        }
      ],
      "variable": [
        {
          "name": "A",
          "latex": "4",
          "decimal": "4"
        },
        {
          "name": "B",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "C",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "D",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "E",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "F",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "y",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "z",
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

const localizationCases = [
  {
    "name": "Table localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-8800000000+S-001410101000000E1010B000D334+P-100000100500000100100000100+V-400000100000000000000000000000000000000000000000000000000000000000000000+E-7747C91A321B+G-41A63647",
    "fields": [
      "tableRange"
    ],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Table",
          "mainMode": "88",
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
        "tableRange": [
          {
            "name": "Start",
            "latex": "1",
            "decimal": "1"
          },
          {
            "name": "End",
            "latex": "5",
            "decimal": "5"
          },
          {
            "name": "Step",
            "latex": "1",
            "decimal": "1"
          }
        ]
      },
      "zh": {
        "mode": {
          "mainName": "函数表格",
          "mainMode": "88",
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
        "tableRange": [
          {
            "name": "开始值",
            "latex": "1",
            "decimal": "1"
          },
          {
            "name": "终止值",
            "latex": "5",
            "decimal": "5"
          },
          {
            "name": "步长",
            "latex": "1",
            "decimal": "1"
          }
        ]
      },
      "vi": {
        "mode": {
          "mainName": "Bảng giá trị",
          "mainMode": "88",
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
        "tableRange": [
          {
            "name": "Bắt đầu",
            "latex": "1",
            "decimal": "1"
          },
          {
            "name": "Kết thúc",
            "latex": "5",
            "decimal": "5"
          },
          {
            "name": "Bước",
            "latex": "1",
            "decimal": "1"
          }
        ]
      },
      "fr": {
        "mode": {
          "mainName": "Tabl fonct",
          "mainMode": "88",
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
        "tableRange": [
          {
            "name": "Début",
            "latex": "1",
            "decimal": "1"
          },
          {
            "name": "Fin",
            "latex": "5",
            "decimal": "5"
          },
          {
            "name": "Pas",
            "latex": "1",
            "decimal": "1"
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
