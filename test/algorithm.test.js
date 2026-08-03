import { test } from 'vitest';

import { assertSetupUnorderedEqual, parse, projectLocalization, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Algorithm-Mode.md
const cases = [
  {
    "name": "Algorithm sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-007A+U-000000000000+M-0E00000000+S-000410110000000E0010B000C5A9+E-F90531313435313400F901F9063200F901F9073300F901F90834003500F901F909F901F90AF901F90B36004100F901F90C4100F901F90D3100F901F90D3200F901F90D3300F901F90D3400F901F90E3700F901F90F3100F901F90F3200F901F910F901F9113900F901F91341A5313000F901F91541A5313100F901F905313200F901F916F901F914F901F912F901F91741A5313300F901F906313400F901F918F901F905C874C9D57D757DD4CA4077787960D02C7C7B7A2221414243444546474849DCC0313233343536373839302EA6A7A8A900F901F9054BD7D8ADAEFD18878889688369848AD9DADBDC6C6D6E6F7071E3E4E5E6E7E2E1E0DFDEDDFD3500F901F919F901F903F901F902",
    "expected": {
      "model": {
        "type": "ClassWiz CW",
        "prefix": "EY",
        "id": "007",
        "name": "fx-92B Secondaire",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Algorithm",
        "mainMode": "0E",
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
          "code": "1"
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
        "algorithm"
      ],
      "algorithm": {
        "latexCommand": [
          "Move\\ 1 1 4 5 1 4\\ pixels",
          "Turn\\ ⟲\\ 2\\ degrees",
          "Direction\\ 3\\ degrees",
          "Goto\\ x=4,\\ y=5",
          "Pen\\ Down",
          "Pen\\ Up",
          "6→\\mathrm{A}",
          "?→\\mathrm{A}",
          "\"Yes\"",
          "\"No\"",
          "\"Number?\"",
          "\"Result :\"",
          "Show\\ Result\\ 7",
          "Style\\ Arrow",
          "Style\\ Cross",
          "Wait",
          "Repeat\\ 9",
          "\\ \\ Repeat\\ until\\ \\mathrm{A} = 1 0",
          "\\ \\ \\ \\ If\\ \\mathrm{A} = 1 1\\ then",
          "\\ \\ \\ \\ \\ \\ Move\\ 1 2\\ pixels",
          "\\ \\ \\ \\ End",
          "\\ \\ ↻",
          "↻",
          "If\\ \\mathrm{A} = 1 3\\ then",
          "\\ \\ Turn\\ ⟲\\ 1 4\\ degrees",
          "Else",
          "\\ \\ Move\\ ⌟ \\sqrt\\!( \\hat{}( \\!^2 \\log( \\ln( \\log( \\!^{-1} \\sqrt[x]\\!( \\mathrm{Ans} \\sin( \\cos( \\tan( ( ) ; \\tan^{-1}( \\cos^{-1}( \\sin^{-1}( \\pi e \\mathrm{A} \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} x y z \\!^{▫} \\text{-} 1 2 3 4 5 6 7 8 9 0 , + - \\times \\div\\ pixels",
          "\\ \\ Move\\ \\theta \\% ! \\textbf{P} \\textbf{C} \\mathrm{Ran\\#} \\mathrm{RanInt\\#}( \\mathrm{GCD}( \\mathrm{LCM}( \\mathrm{Abs}( \\mathrm{Int}( \\mathrm{Rnd}( \\mathrm{Intg}( \\mathrm{RndFix}( \\!^{\\circ} \\!^{\\mathrm{r}} \\!^{\\mathrm{g}} \\!^{▫} \\sinh( \\cosh( \\tanh( \\sinh^{-1}( \\cosh^{-1}( \\tanh^{-1}( \\textbf{m} \\textbf{μ} \\textbf{n} \\textbf{p} \\textbf{f} \\textbf{k} \\textbf{M} \\textbf{G} \\textbf{T} \\textbf{P} \\textbf{E} {h}\\ pixels",
          "End",
          "\\ "
        ],
        "textCommand": [
          "Move 114514 pixels",
          "Turn ⟲ 2 degrees",
          "Direction 3 degrees",
          "Goto x=4, y=5",
          "Pen Down",
          "Pen Up",
          "6→A",
          "?→A",
          "\"Yes\"",
          "\"No\"",
          "\"Number?\"",
          "\"Result :\"",
          "Show Result 7",
          "Style Arrow",
          "Style Cross",
          "Wait",
          "Repeat 9",
          "  Repeat until A=10",
          "    If A=11 then",
          "      Move 12 pixels",
          "    End",
          "  ↻",
          "↻",
          "If A=13 then",
          "  Turn ⟲ 14 degrees",
          "Else",
          "  Move ⌟√(^(²log(ln(log(⁻¹[x]√(Anssin(cos(tan(();tan⁻¹(cos⁻¹(sin⁻¹(πeABCDEFxyz▫-1234567890,+-×÷ pixels",
          "  Move θ%!𝐏𝐂Ran#RanInt#(GCD(LCM(Abs(Int(Rnd(Intg(RndFix(°ʳᵍ▫sinh(cosh(tanh(sinh⁻¹(cosh⁻¹(tanh⁻¹(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h pixels",
          "End",
          " "
        ],
        "scratchBlocks": [
          "move (114514) steps",
          "turn @turnLeft (2) degrees",
          "point in direction (3)",
          "go to x:(4) y:(5)",
          "pen down",
          "pen up",
          "set [A v] to (6)",
          "ask [value?] and wait\nset [A v] to (answer)",
          "say [Yes]\nwait until <key [any v] pressed?>",
          "say [No]\nwait until <key [any v] pressed?>",
          "say [Number?]\nwait until <key [any v] pressed?>",
          "say [Result :]\nwait until <key [any v] pressed?>",
          "say (7)\nwait until <key [any v] pressed?>",
          "switch costume to [Arrow v]",
          "switch costume to [Cross v]",
          "wait until <key [any v] pressed?>",
          "repeat (9)",
          "  repeat until [A=10]",
          "    if [A=11] then",
          "      move (12) steps",
          "    end",
          "  end",
          "end",
          "if [A=13] then",
          "  turn @turnLeft (14) degrees",
          "else",
          "  move (⌟√\\(^\\(²log\\(ln\\(log\\(⁻¹\\[x\\]√\\(Anssin\\(cos\\(tan\\(\\(\\);tan⁻¹\\(cos⁻¹\\(sin⁻¹\\(πeABCDEFxyz▫-1234567890,+-×÷) steps",
          "  move (θ%!𝐏𝐂Ran#RanInt#\\(GCD\\(LCM\\(Abs\\(Int\\(Rnd\\(Intg\\(RndFix\\(°ʳᵍ▫sinh\\(cosh\\(tanh\\(sinh⁻¹\\(cosh⁻¹\\(tanh⁻¹\\(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h) steps",
          "end",
          " "
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
    "name": "Algorithm localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-007A+U-000000000000+M-0E00000000+S-000410110000000E0010B000C5A9+E-F90531313435313400F901F9063200F901F9073300F901F90834003500F901F909F901F90AF901F90B36004100F901F90C4100F901F90D3100F901F90D3200F901F90D3300F901F90D3400F901F90E3700F901F90F3100F901F90F3200F901F910F901F9113900F901F91341A5313000F901F91541A5313100F901F905313200F901F916F901F914F901F912F901F91741A5313300F901F906313400F901F918F901F905C874C9D57D757DD4CA4077787960D02C7C7B7A2221414243444546474849DCC0313233343536373839302EA6A7A8A900F901F9054BD7D8ADAEFD18878889688369848AD9DADBDC6C6D6E6F7071E3E4E5E6E7E2E1E0DFDEDDFD3500F901F919F901F903F901F902",
    "fields": [
      "algorithm"
    ],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Algorithm",
          "mainMode": "0E",
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
            "value": "Comma",
            "type": "DECIMAL_MARK",
            "code": "0"
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
            "value": "On",
            "type": "STATISTICS_FREQUENCY",
            "code": "1"
          },
          {
            "name": "Recurring Decimal",
            "value": "Off",
            "type": "RECURRING_DECIMAL",
            "code": "0"
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
            "value": "Off",
            "type": "EQUATION_COMPLEX_ROOT",
            "code": "0"
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
        "algorithm": {
          "latexCommand": [
            "Move\\ 1 1 4 5 1 4\\ pixels",
            "Turn\\ ⟲\\ 2\\ degrees",
            "Direction\\ 3\\ degrees",
            "Goto\\ x=4,\\ y=5",
            "Pen\\ Down",
            "Pen\\ Up",
            "6→\\mathrm{A}",
            "?→\\mathrm{A}",
            "\"Yes\"",
            "\"No\"",
            "\"Number?\"",
            "\"Result :\"",
            "Show\\ Result\\ 7",
            "Style\\ Arrow",
            "Style\\ Cross",
            "Wait",
            "Repeat\\ 9",
            "\\ \\ Repeat\\ until\\ \\mathrm{A} = 1 0",
            "\\ \\ \\ \\ If\\ \\mathrm{A} = 1 1\\ then",
            "\\ \\ \\ \\ \\ \\ Move\\ 1 2\\ pixels",
            "\\ \\ \\ \\ End",
            "\\ \\ ↻",
            "↻",
            "If\\ \\mathrm{A} = 1 3\\ then",
            "\\ \\ Turn\\ ⟲\\ 1 4\\ degrees",
            "Else",
            "\\ \\ Move\\ ⌟ \\sqrt\\!( \\hat{}( \\!^2 \\log( \\ln( \\log( \\!^{-1} \\sqrt[x]\\!( \\mathrm{Ans} \\sin( \\cos( \\tan( ( ) ; \\tan^{-1}( \\cos^{-1}( \\sin^{-1}( \\pi e \\mathrm{A} \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} x y z \\!^{▫} \\text{-} 1 2 3 4 5 6 7 8 9 0 , + - \\times \\div\\ pixels",
            "\\ \\ Move\\ \\theta \\% ! \\textbf{P} \\textbf{C} \\mathrm{Ran\\#} \\mathrm{RanInt\\#}( \\mathrm{GCD}( \\mathrm{LCM}( \\mathrm{Abs}( \\mathrm{Int}( \\mathrm{Rnd}( \\mathrm{Intg}( \\mathrm{RndFix}( \\!^{\\circ} \\!^{\\mathrm{r}} \\!^{\\mathrm{g}} \\!^{▫} \\sinh( \\cosh( \\tanh( \\sinh^{-1}( \\cosh^{-1}( \\tanh^{-1}( \\textbf{m} \\textbf{μ} \\textbf{n} \\textbf{p} \\textbf{f} \\textbf{k} \\textbf{M} \\textbf{G} \\textbf{T} \\textbf{P} \\textbf{E} {h}\\ pixels",
            "End",
            "\\ "
          ],
          "textCommand": [
            "Move 114514 pixels",
            "Turn ⟲ 2 degrees",
            "Direction 3 degrees",
            "Goto x=4, y=5",
            "Pen Down",
            "Pen Up",
            "6→A",
            "?→A",
            "\"Yes\"",
            "\"No\"",
            "\"Number?\"",
            "\"Result :\"",
            "Show Result 7",
            "Style Arrow",
            "Style Cross",
            "Wait",
            "Repeat 9",
            "  Repeat until A=10",
            "    If A=11 then",
            "      Move 12 pixels",
            "    End",
            "  ↻",
            "↻",
            "If A=13 then",
            "  Turn ⟲ 14 degrees",
            "Else",
            "  Move ⌟√(^(²log(ln(log(⁻¹[x]√(Anssin(cos(tan(();tan⁻¹(cos⁻¹(sin⁻¹(πeABCDEFxyz▫-1234567890,+-×÷ pixels",
            "  Move θ%!𝐏𝐂Ran#RanInt#(GCD(LCM(Abs(Int(Rnd(Intg(RndFix(°ʳᵍ▫sinh(cosh(tanh(sinh⁻¹(cosh⁻¹(tanh⁻¹(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h pixels",
            "End",
            " "
          ],
          "scratchBlocks": [
            "move (114514) steps",
            "turn @turnLeft (2) degrees",
            "point in direction (3)",
            "go to x:(4) y:(5)",
            "pen down",
            "pen up",
            "set [A v] to (6)",
            "ask [value?] and wait\nset [A v] to (answer)",
            "say [Yes]\nwait until <key [any v] pressed?>",
            "say [No]\nwait until <key [any v] pressed?>",
            "say [Number?]\nwait until <key [any v] pressed?>",
            "say [Result :]\nwait until <key [any v] pressed?>",
            "say (7)\nwait until <key [any v] pressed?>",
            "switch costume to [Arrow v]",
            "switch costume to [Cross v]",
            "wait until <key [any v] pressed?>",
            "repeat (9)",
            "  repeat until [A=10]",
            "    if [A=11] then",
            "      move (12) steps",
            "    end",
            "  end",
            "end",
            "if [A=13] then",
            "  turn @turnLeft (14) degrees",
            "else",
            "  move (⌟√\\(^\\(²log\\(ln\\(log\\(⁻¹\\[x\\]√\\(Anssin\\(cos\\(tan\\(\\(\\);tan⁻¹\\(cos⁻¹\\(sin⁻¹\\(πeABCDEFxyz▫-1234567890,+-×÷) steps",
            "  move (θ%!𝐏𝐂Ran#RanInt#\\(GCD\\(LCM\\(Abs\\(Int\\(Rnd\\(Intg\\(RndFix\\(°ʳᵍ▫sinh\\(cosh\\(tanh\\(sinh⁻¹\\(cosh⁻¹\\(tanh⁻¹\\(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h) steps",
            "end",
            " "
          ]
        }
      },
      "zh": {
        "mode": {
          "mainName": "算法",
          "mainMode": "0E",
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
            "value": "逗点",
            "type": "DECIMAL_MARK",
            "code": "0"
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
            "value": "开",
            "type": "STATISTICS_FREQUENCY",
            "code": "1"
          },
          {
            "name": "循环小数",
            "value": "关",
            "type": "RECURRING_DECIMAL",
            "code": "0"
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
            "value": "关",
            "type": "EQUATION_COMPLEX_ROOT",
            "code": "0"
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
        "algorithm": {
          "latexCommand": [
            "前进\\ 1 1 4 5 1 4\\ 像素",
            "旋转⟲\\ 2\\ 度",
            "面向θ\\ 3\\ 度",
            "移到\\ x=4,\\ y=5",
            "下笔",
            "抬笔",
            "6→\\mathrm{A}",
            "?→\\mathrm{A}",
            "\"是\"",
            "\"否\"",
            "\"数值?\"",
            "\"结果 :\"",
            "显示结果\\ 7",
            "样式\\ 箭头",
            "样式\\ 十字",
            "等待",
            "循环\\ 9",
            "\\ \\ 循环直到\\ \\mathrm{A} = 1 0",
            "\\ \\ \\ \\ 如果\\ \\mathrm{A} = 1 1\\ 则",
            "\\ \\ \\ \\ \\ \\ 前进\\ 1 2\\ 像素",
            "\\ \\ \\ \\ 结束",
            "\\ \\ ↻",
            "↻",
            "如果\\ \\mathrm{A} = 1 3\\ 则",
            "\\ \\ 旋转⟲\\ 1 4\\ 度",
            "否则",
            "\\ \\ 前进\\ ⌟ \\sqrt\\!( \\hat{}( \\!^2 \\log( \\ln( \\log( \\!^{-1} \\sqrt[x]\\!( \\mathrm{Ans} \\sin( \\cos( \\tan( ( ) ; \\tan^{-1}( \\cos^{-1}( \\sin^{-1}( \\pi e \\mathrm{A} \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} x y z \\!^{▫} \\text{-} 1 2 3 4 5 6 7 8 9 0 , + - \\times \\div\\ 像素",
            "\\ \\ 前进\\ \\theta \\% ! \\textbf{P} \\textbf{C} \\mathrm{Ran\\#} \\mathrm{RanInt\\#}( \\mathrm{GCD}( \\mathrm{LCM}( \\mathrm{Abs}( \\mathrm{Int}( \\mathrm{Rnd}( \\mathrm{Intg}( \\mathrm{RndFix}( \\!^{\\circ} \\!^{\\mathrm{r}} \\!^{\\mathrm{g}} \\!^{▫} \\sinh( \\cosh( \\tanh( \\sinh^{-1}( \\cosh^{-1}( \\tanh^{-1}( \\textbf{m} \\textbf{μ} \\textbf{n} \\textbf{p} \\textbf{f} \\textbf{k} \\textbf{M} \\textbf{G} \\textbf{T} \\textbf{P} \\textbf{E} {h}\\ 像素",
            "结束",
            "\\ "
          ],
          "textCommand": [
            "前进 114514 像素",
            "旋转⟲ 2 度",
            "面向θ 3 度",
            "移到 x=4, y=5",
            "下笔",
            "抬笔",
            "6→A",
            "?→A",
            "\"是\"",
            "\"否\"",
            "\"数值?\"",
            "\"结果 :\"",
            "显示结果 7",
            "样式 箭头",
            "样式 十字",
            "等待",
            "循环 9",
            "  循环直到 A=10",
            "    如果 A=11 则",
            "      前进 12 像素",
            "    结束",
            "  ↻",
            "↻",
            "如果 A=13 则",
            "  旋转⟲ 14 度",
            "否则",
            "  前进 ⌟√(^(²log(ln(log(⁻¹[x]√(Anssin(cos(tan(();tan⁻¹(cos⁻¹(sin⁻¹(πeABCDEFxyz▫-1234567890,+-×÷ 像素",
            "  前进 θ%!𝐏𝐂Ran#RanInt#(GCD(LCM(Abs(Int(Rnd(Intg(RndFix(°ʳᵍ▫sinh(cosh(tanh(sinh⁻¹(cosh⁻¹(tanh⁻¹(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h 像素",
            "结束",
            " "
          ],
          "scratchBlocks": [
            "move (114514) steps",
            "turn @turnLeft (2) degrees",
            "point in direction (3)",
            "go to x:(4) y:(5)",
            "pen down",
            "pen up",
            "set [A v] to (6)",
            "ask [输入值?] and wait\nset [A v] to (answer)",
            "say [是]\nwait until <key [任意 v] pressed?>",
            "say [否]\nwait until <key [任意 v] pressed?>",
            "say [数值?]\nwait until <key [任意 v] pressed?>",
            "say [结果 :]\nwait until <key [任意 v] pressed?>",
            "say (7)\nwait until <key [任意 v] pressed?>",
            "switch costume to [箭头 v]",
            "switch costume to [十字 v]",
            "wait until <key [任意 v] pressed?>",
            "repeat (9)",
            "  repeat until [A=10]",
            "    if [A=11] then",
            "      move (12) steps",
            "    end",
            "  end",
            "end",
            "if [A=13] then",
            "  turn @turnLeft (14) degrees",
            "else",
            "  move (⌟√\\(^\\(²log\\(ln\\(log\\(⁻¹\\[x\\]√\\(Anssin\\(cos\\(tan\\(\\(\\);tan⁻¹\\(cos⁻¹\\(sin⁻¹\\(πeABCDEFxyz▫-1234567890,+-×÷) steps",
            "  move (θ%!𝐏𝐂Ran#RanInt#\\(GCD\\(LCM\\(Abs\\(Int\\(Rnd\\(Intg\\(RndFix\\(°ʳᵍ▫sinh\\(cosh\\(tanh\\(sinh⁻¹\\(cosh⁻¹\\(tanh⁻¹\\(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h) steps",
            "end",
            " "
          ]
        }
      },
      "vi": {
        "mode": {
          "mainName": "Thuật toán",
          "mainMode": "0E",
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
            "value": "Phẩy",
            "type": "DECIMAL_MARK",
            "code": "0"
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
            "value": "Bật",
            "type": "STATISTICS_FREQUENCY",
            "code": "1"
          },
          {
            "name": "Số thập phân tuần hoàn",
            "value": "Tắt",
            "type": "RECURRING_DECIMAL",
            "code": "0"
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
            "value": "Tắt",
            "type": "EQUATION_COMPLEX_ROOT",
            "code": "0"
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
        "algorithm": {
          "latexCommand": [
            "Move\\ 1 1 4 5 1 4\\ pixel",
            "Turn\\ ⟲\\ 2\\ degrees",
            "Direction\\ 3\\ degrees",
            "Goto\\ x=4,\\ y=5",
            "Pen\\ Down",
            "Pen\\ Up",
            "6→\\mathrm{A}",
            "?→\\mathrm{A}",
            "\"Yes\"",
            "\"No\"",
            "\"Number?\"",
            "\"Result :\"",
            "Show\\ Result\\ 7",
            "Style\\ Arrow",
            "Style\\ Cross",
            "Wait",
            "Repeat\\ 9",
            "\\ \\ Repeat\\ until\\ \\mathrm{A} = 1 0",
            "\\ \\ \\ \\ If\\ \\mathrm{A} = 1 1\\ then",
            "\\ \\ \\ \\ \\ \\ Move\\ 1 2\\ pixel",
            "\\ \\ \\ \\ End",
            "\\ \\ ↻",
            "↻",
            "If\\ \\mathrm{A} = 1 3\\ then",
            "\\ \\ Turn\\ ⟲\\ 1 4\\ degrees",
            "Else",
            "\\ \\ Move\\ ⌟ \\sqrt\\!( \\hat{}( \\!^2 \\log( \\ln( \\log( \\!^{-1} \\sqrt[x]\\!( \\mathrm{Ans} \\sin( \\cos( \\tan( ( ) ; \\tan^{-1}( \\cos^{-1}( \\sin^{-1}( \\pi e \\mathrm{A} \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} x y z \\!^{▫} \\text{-} 1 2 3 4 5 6 7 8 9 0 , + - \\times \\div\\ pixel",
            "\\ \\ Move\\ \\theta \\% ! \\textbf{P} \\textbf{C} \\mathrm{Ran\\#} \\mathrm{RanInt\\#}( \\mathrm{GCD}( \\mathrm{LCM}( \\mathrm{Abs}( \\mathrm{Int}( \\mathrm{Rnd}( \\mathrm{Intg}( \\mathrm{RndFix}( \\!^{\\circ} \\!^{\\mathrm{r}} \\!^{\\mathrm{g}} \\!^{▫} \\sinh( \\cosh( \\tanh( \\sinh^{-1}( \\cosh^{-1}( \\tanh^{-1}( \\textbf{m} \\textbf{μ} \\textbf{n} \\textbf{p} \\textbf{f} \\textbf{k} \\textbf{M} \\textbf{G} \\textbf{T} \\textbf{P} \\textbf{E} {h}\\ pixel",
            "End",
            "\\ "
          ],
          "textCommand": [
            "Move 114514 pixel",
            "Turn ⟲ 2 degrees",
            "Direction 3 degrees",
            "Goto x=4, y=5",
            "Pen Down",
            "Pen Up",
            "6→A",
            "?→A",
            "\"Yes\"",
            "\"No\"",
            "\"Number?\"",
            "\"Result :\"",
            "Show Result 7",
            "Style Arrow",
            "Style Cross",
            "Wait",
            "Repeat 9",
            "  Repeat until A=10",
            "    If A=11 then",
            "      Move 12 pixel",
            "    End",
            "  ↻",
            "↻",
            "If A=13 then",
            "  Turn ⟲ 14 degrees",
            "Else",
            "  Move ⌟√(^(²log(ln(log(⁻¹[x]√(Anssin(cos(tan(();tan⁻¹(cos⁻¹(sin⁻¹(πeABCDEFxyz▫-1234567890,+-×÷ pixel",
            "  Move θ%!𝐏𝐂Ran#RanInt#(GCD(LCM(Abs(Int(Rnd(Intg(RndFix(°ʳᵍ▫sinh(cosh(tanh(sinh⁻¹(cosh⁻¹(tanh⁻¹(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h pixel",
            "End",
            " "
          ],
          "scratchBlocks": [
            "move (114514) steps",
            "turn @turnLeft (2) degrees",
            "point in direction (3)",
            "go to x:(4) y:(5)",
            "pen down",
            "pen up",
            "set [A v] to (6)",
            "ask [value?] and wait\nset [A v] to (answer)",
            "say [Yes]\nwait until <key [any v] pressed?>",
            "say [No]\nwait until <key [any v] pressed?>",
            "say [Number?]\nwait until <key [any v] pressed?>",
            "say [Result :]\nwait until <key [any v] pressed?>",
            "say (7)\nwait until <key [any v] pressed?>",
            "switch costume to [Arrow v]",
            "switch costume to [Cross v]",
            "wait until <key [any v] pressed?>",
            "repeat (9)",
            "  repeat until [A=10]",
            "    if [A=11] then",
            "      move (12) steps",
            "    end",
            "  end",
            "end",
            "if [A=13] then",
            "  turn @turnLeft (14) degrees",
            "else",
            "  move (⌟√\\(^\\(²log\\(ln\\(log\\(⁻¹\\[x\\]√\\(Anssin\\(cos\\(tan\\(\\(\\);tan⁻¹\\(cos⁻¹\\(sin⁻¹\\(πeABCDEFxyz▫-1234567890,+-×÷) steps",
            "  move (θ%!𝐏𝐂Ran#RanInt#\\(GCD\\(LCM\\(Abs\\(Int\\(Rnd\\(Intg\\(RndFix\\(°ʳᵍ▫sinh\\(cosh\\(tanh\\(sinh⁻¹\\(cosh⁻¹\\(tanh⁻¹\\(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h) steps",
            "end",
            " "
          ]
        }
      },
      "fr": {
        "mode": {
          "mainName": "Algo",
          "mainMode": "0E",
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
            "value": "Virgule",
            "type": "DECIMAL_MARK",
            "code": "0"
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
            "value": "Activé",
            "type": "STATISTICS_FREQUENCY",
            "code": "1"
          },
          {
            "name": "Décimale périodique",
            "value": "Désactivé",
            "type": "RECURRING_DECIMAL",
            "code": "0"
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
            "value": "Désactivé",
            "type": "EQUATION_COMPLEX_ROOT",
            "code": "0"
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
        "algorithm": {
          "latexCommand": [
            "Avancer\\ de\\ 1 1 4 5 1 4\\ pixels",
            "Tourner\\ de\\ ⟲\\ 2\\ degrés",
            "S'orienter\\ à\\ 3\\ degrés",
            "Aller\\ à\\ x=4;\\ y=5",
            "Stylo\\ écrit",
            "Stylo\\ relevé",
            "6→\\mathrm{A}",
            "?→\\mathrm{A}",
            "\"Oui\"",
            "\"Non\"",
            "\"Nombre?\"",
            "\"Résultat :\"",
            "Afficher\\ résult\\ 7",
            "Style\\ Flèche",
            "Style\\ Croix",
            "Attendre",
            "Répéter\\ 9",
            "\\ \\ Répéter\\ jusqu'à\\ \\mathrm{A} = 1 0",
            "\\ \\ \\ \\ Si\\ \\mathrm{A} = 1 1\\ Alors",
            "\\ \\ \\ \\ \\ \\ Avancer\\ de\\ 1 2\\ pixels",
            "\\ \\ \\ \\ Fin",
            "\\ \\ ↻",
            "↻",
            "Si\\ \\mathrm{A} = 1 3\\ Alors",
            "\\ \\ Tourner\\ de\\ ⟲\\ 1 4\\ degrés",
            "Sinon",
            "\\ \\ Avancer\\ de\\ ⌟ \\sqrt\\!( \\hat{}( \\!^2 \\log( \\ln( \\log( \\!^{-1} \\sqrt[x]\\!( \\mathrm{Ans} \\sin( \\cos( \\tan( ( ) ; \\tan^{-1}( \\cos^{-1}( \\sin^{-1}( \\pi e \\mathrm{A} \\mathrm{B} \\mathrm{C} \\mathrm{D} \\mathrm{E} \\mathrm{F} x y z \\!^{▫} \\text{-} 1 2 3 4 5 6 7 8 9 0 , + - \\times \\div\\ pixels",
            "\\ \\ Avancer\\ de\\ \\theta \\% ! \\textbf{P} \\textbf{C} \\mathrm{Ran\\#} \\mathrm{RanInt\\#}( \\mathrm{GCD}( \\mathrm{LCM}( \\mathrm{Abs}( \\mathrm{Int}( \\mathrm{Rnd}( \\mathrm{Intg}( \\mathrm{RndFix}( \\!^{\\circ} \\!^{\\mathrm{r}} \\!^{\\mathrm{g}} \\!^{▫} \\sinh( \\cosh( \\tanh( \\sinh^{-1}( \\cosh^{-1}( \\tanh^{-1}( \\textbf{m} \\textbf{μ} \\textbf{n} \\textbf{p} \\textbf{f} \\textbf{k} \\textbf{M} \\textbf{G} \\textbf{T} \\textbf{P} \\textbf{E} {h}\\ pixels",
            "Fin",
            "\\ "
          ],
          "textCommand": [
            "Avancer de 114514 pixels",
            "Tourner de ⟲ 2 degrés",
            "S'orienter à 3 degrés",
            "Aller à x=4; y=5",
            "Stylo écrit",
            "Stylo relevé",
            "6→A",
            "?→A",
            "\"Oui\"",
            "\"Non\"",
            "\"Nombre?\"",
            "\"Résultat :\"",
            "Afficher résult 7",
            "Style Flèche",
            "Style Croix",
            "Attendre",
            "Répéter 9",
            "  Répéter jusqu'à A=10",
            "    Si A=11 Alors",
            "      Avancer de 12 pixels",
            "    Fin",
            "  ↻",
            "↻",
            "Si A=13 Alors",
            "  Tourner de ⟲ 14 degrés",
            "Sinon",
            "  Avancer de ⌟√(^(²log(ln(log(⁻¹[x]√(Anssin(cos(tan(();tan⁻¹(cos⁻¹(sin⁻¹(πeABCDEFxyz▫-1234567890,+-×÷ pixels",
            "  Avancer de θ%!𝐏𝐂Ran#RanInt#(GCD(LCM(Abs(Int(Rnd(Intg(RndFix(°ʳᵍ▫sinh(cosh(tanh(sinh⁻¹(cosh⁻¹(tanh⁻¹(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h pixels",
            "Fin",
            " "
          ],
          "scratchBlocks": [
            "move (114514) steps",
            "turn @turnLeft (2) degrees",
            "point in direction (3)",
            "go to x:(4) y:(5)",
            "pen down",
            "pen up",
            "set [A v] to (6)",
            "ask [valeur?] and wait\nset [A v] to (answer)",
            "say [Oui]\nwait until <key [n'importe laquelle v] pressed?>",
            "say [Non]\nwait until <key [n'importe laquelle v] pressed?>",
            "say [Nombre?]\nwait until <key [n'importe laquelle v] pressed?>",
            "say [Résultat :]\nwait until <key [n'importe laquelle v] pressed?>",
            "say (7)\nwait until <key [n'importe laquelle v] pressed?>",
            "switch costume to [Flèche v]",
            "switch costume to [Croix v]",
            "wait until <key [n'importe laquelle v] pressed?>",
            "repeat (9)",
            "  repeat until [A=10]",
            "    if [A=11] then",
            "      move (12) steps",
            "    end",
            "  end",
            "end",
            "if [A=13] then",
            "  turn @turnLeft (14) degrees",
            "else",
            "  move (⌟√\\(^\\(²log\\(ln\\(log\\(⁻¹\\[x\\]√\\(Anssin\\(cos\\(tan\\(\\(\\);tan⁻¹\\(cos⁻¹\\(sin⁻¹\\(πeABCDEFxyz▫-1234567890,+-×÷) steps",
            "  move (θ%!𝐏𝐂Ran#RanInt#\\(GCD\\(LCM\\(Abs\\(Int\\(Rnd\\(Intg\\(RndFix\\(°ʳᵍ▫sinh\\(cosh\\(tanh\\(sinh⁻¹\\(cosh⁻¹\\(tanh⁻¹\\(𝐦𝐦𝐧𝐩𝐟𝐤𝐌𝐆𝐓𝐏𝐄h) steps",
            "end",
            " "
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
