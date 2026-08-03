import { test } from 'vitest';

import { assertSetupUnorderedEqual, parse, projectLocalization, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Statistics-Mode.md
const cases = [
  {
    "name": "Statistics sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0301000000+S-001410101000000E1010B000E9F8+T-340034FK0034S40034",
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
        "mainName": "Statistics",
        "subName": "Single-Variable Statistic",
        "mainMode": "03",
        "subMode": "01"
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
        "statistic"
      ],
      "statistic": {
        "array": [
          [
            "x"
          ],
          [
            "1"
          ],
          [
            "5"
          ],
          [
            "9"
          ]
        ],
        "csv": "x\n1\n5\n9"
      }
    }
  },
  {
    "name": "Statistics sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0301F10000+S-001410101000000E1010B000D7BD+R-05000000000000000100015000000000000001010107000000000000010201066666666666660101032659863237109001000160000000000000010104000000000000000100030000000000000001000100000000000000010001000000000000000100050000000000000001000900000000000000010009000000000000000100",
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
        "mainName": "Statistics",
        "subName": "Single-Variable Statistic",
        "mainMode": "03",
        "subMode": "01"
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
        "result"
      ],
      "result": [
        {
          "name": "templated",
          "latex": "\\bar{x}=5 \\\\ \\rm{\\Sigma}x=15 \\\\ \\rm{\\Sigma}x^2=107 \\\\ \\rm{\\sigma}^2x= \\dfrac {\\displaystyle 32} {\\displaystyle 3} \\\\ \\rm{\\sigma}x=3.2659863237109 \\\\ \\rm{s}^2x=16 \\\\ \\rm{s}x=4 \\\\ n=3 \\\\ \\min(x)=1 \\\\ \\rm{Q}_{1}=1 \\\\ \\rm{Med}=5 \\\\ \\rm{Q}_3=9 \\\\ \\max(x)=9"
        },
        {
          "name": "Part1",
          "latex": "5",
          "decimal": "5"
        },
        {
          "name": "Part2",
          "latex": "15",
          "decimal": "15"
        },
        {
          "name": "Part3",
          "latex": "107",
          "decimal": "107"
        },
        {
          "name": "Part4",
          "latex": " \\dfrac {\\displaystyle 32} {\\displaystyle 3}",
          "decimal": "10.6666666666666"
        },
        {
          "name": "Part5",
          "latex": "3.2659863237109",
          "decimal": "3.2659863237109"
        },
        {
          "name": "Part6",
          "latex": "16",
          "decimal": "16"
        },
        {
          "name": "Part7",
          "latex": "4",
          "decimal": "4"
        },
        {
          "name": "Part8",
          "latex": "3",
          "decimal": "3"
        },
        {
          "name": "Part9",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "Part10",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "Part11",
          "latex": "5",
          "decimal": "5"
        },
        {
          "name": "Part12",
          "latex": "9",
          "decimal": "9"
        },
        {
          "name": "Part13",
          "latex": "9",
          "decimal": "9"
        }
      ]
    }
  },
  {
    "name": "Statistics sample 3",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0302A00000+S-001410101000000E1010B00081E8+T-340034FK0034680034IO00349C0034LS0034",
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
        "mainName": "Statistics",
        "subName": "Linear Regression [y=a+bx]",
        "mainMode": "03",
        "subMode": "02"
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
        "statistic"
      ],
      "statistic": {
        "array": [
          [
            "x",
            "y"
          ],
          [
            "1",
            "5"
          ],
          [
            "2",
            "6"
          ],
          [
            "3",
            "7"
          ]
        ],
        "csv": "x,y\n1,5\n2,6\n3,7"
      }
    }
  },
  {
    "name": "Statistics sample 4",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0302F20000+S-001410101000000E1010B000D75C+R-0200000000000000010006000000000000000100014000000000000001010666666666666666009908164965809277260099010000000000000001000100000000000000010003000000000000000100060000000000000001000180000000000000010101100000000000000102066666666666666600990816496580927726009901000000000000000100010000000000000001000380000000000000010103600000000000000101092000000000000001010980000000000000010101000000000000000100030000000000000001000500000000000000010007000000000000000100",
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
        "mainName": "Statistics",
        "subName": "Linear Regression [y=a+bx]",
        "mainMode": "03",
        "subMode": "02"
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
        "result"
      ],
      "result": [
        {
          "name": "templated",
          "latex": "\\bar{x}=2 \\\\ \\rm{\\Sigma}x=6 \\\\ \\rm{\\Sigma}x^2=14 \\\\ \\rm{\\sigma}^2x= \\dfrac {\\displaystyle 2} {\\displaystyle 3} \\\\ \\rm{\\sigma}x=0.816496580927726 \\\\ \\rm{s}^2x=1 \\\\ \\rm{s}x=1 \\\\ n=3 \\\\ \\bar{y}=6 \\\\ \\rm{\\Sigma}y=18 \\\\ \\rm{\\Sigma}y^2=110 \\\\ \\rm{\\sigma}^2y= \\dfrac {\\displaystyle 2} {\\displaystyle 3} \\\\ \\rm{\\sigma}y=0.816496580927726 \\\\ \\rm{s}^2y=1 \\\\ \\rm{s}y=1 \\\\ \\rm{\\Sigma}xy=38 \\\\ \\rm{\\Sigma}x^3=36 \\\\ \\rm{\\Sigma}x^2y=92 \\\\ \\rm{\\Sigma}x^4=98 \\\\ \\min(x)=1 \\\\ \\max(x)=3 \\\\ \\min(y)=5 \\\\ \\max(y)=7"
        },
        {
          "name": "Part1",
          "latex": "2",
          "decimal": "2"
        },
        {
          "name": "Part2",
          "latex": "6",
          "decimal": "6"
        },
        {
          "name": "Part3",
          "latex": "14",
          "decimal": "14"
        },
        {
          "name": "Part4",
          "latex": " \\dfrac {\\displaystyle 2} {\\displaystyle 3}",
          "decimal": "0.666666666666666"
        },
        {
          "name": "Part5",
          "latex": "0.816496580927726",
          "decimal": "0.816496580927726"
        },
        {
          "name": "Part6",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "Part7",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "Part8",
          "latex": "3",
          "decimal": "3"
        },
        {
          "name": "Part9",
          "latex": "6",
          "decimal": "6"
        },
        {
          "name": "Part10",
          "latex": "18",
          "decimal": "18"
        },
        {
          "name": "Part11",
          "latex": "110",
          "decimal": "110"
        },
        {
          "name": "Part12",
          "latex": " \\dfrac {\\displaystyle 2} {\\displaystyle 3}",
          "decimal": "0.666666666666666"
        },
        {
          "name": "Part13",
          "latex": "0.816496580927726",
          "decimal": "0.816496580927726"
        },
        {
          "name": "Part14",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "Part15",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "Part16",
          "latex": "38",
          "decimal": "38"
        },
        {
          "name": "Part17",
          "latex": "36",
          "decimal": "36"
        },
        {
          "name": "Part18",
          "latex": "92",
          "decimal": "92"
        },
        {
          "name": "Part19",
          "latex": "98",
          "decimal": "98"
        },
        {
          "name": "Part20",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "Part21",
          "latex": "3",
          "decimal": "3"
        },
        {
          "name": "Part22",
          "latex": "5",
          "decimal": "5"
        },
        {
          "name": "Part23",
          "latex": "7",
          "decimal": "7"
        }
      ]
    }
  },
  {
    "name": "Statistics sample 5",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0302F30000+S-001410101000000E1010B0004D37+R-040000000000000001000100000000000000010001000000000000000100",
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
        "mainName": "Statistics",
        "subName": "Linear Regression [y=a+bx]",
        "mainMode": "03",
        "subMode": "02"
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
        "result"
      ],
      "result": [
        {
          "name": "templated",
          "latex": "y=a+bx \\\\ a=4 \\\\ b=1 \\\\ r=1"
        },
        {
          "name": "Part1",
          "latex": "4",
          "decimal": "4"
        },
        {
          "name": "Part2",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "Part3",
          "latex": "1",
          "decimal": "1"
        }
      ]
    }
  },
  {
    "name": "Statistics sample 6",
    "url": "http://wes.casio.com/ncal/index.php?q=I-015A+U-000000000000+M-0302F30000+S-400410100000000E1010B0009C5E+R-010000000000000001000400000000000000010001000000000000000100",
    "expected": {
      "model": {
        "type": "ClassWiz CW",
        "prefix": "EY",
        "id": "015",
        "name": "fx-991DE CW",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Statistics",
        "subName": "Linear Regression [y=ax+b]",
        "mainMode": "03",
        "subMode": "02"
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
          "code": "40"
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
        "result"
      ],
      "result": [
        {
          "name": "templated",
          "latex": "y=ax+b \\\\ a=1 \\\\ b=4 \\\\ r=1"
        },
        {
          "name": "Part1",
          "latex": "1",
          "decimal": "1"
        },
        {
          "name": "Part2",
          "latex": "4",
          "decimal": "4"
        },
        {
          "name": "Part3",
          "latex": "1",
          "decimal": "1"
        }
      ]
    }
  },
  {
    "name": "Statistics sample 7",
    "url": "http://wes.casio.com/ncal/index.php?q=I-506A+U-000000000000+M-0302F30000+S-400410111000000E0010B000741A+R-02000000000000000100016666666666666601000960768922830522009909230769230769230099",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "FY",
        "id": "506",
        "name": "fx-92+ Collège",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Statistics",
        "subName": "Linear Regression [y=a+bx]",
        "mainMode": "03",
        "subMode": "02"
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
          "code": "40"
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
        "result"
      ],
      "result": [
        {
          "name": "templated",
          "latex": "y=a+bx \\\\ a=2 \\\\ b= \\dfrac {\\displaystyle 5} {\\displaystyle 3} \\\\ r=0,960768922830522 \\\\ r²= \\dfrac {\\displaystyle 12} {\\displaystyle 13}"
        },
        {
          "name": "Part1",
          "latex": "2",
          "decimal": "2"
        },
        {
          "name": "Part2",
          "latex": " \\dfrac {\\displaystyle 5} {\\displaystyle 3}",
          "decimal": "1.66666666666666"
        },
        {
          "name": "Part3",
          "latex": "0,960768922830522",
          "decimal": "0.960768922830522"
        },
        {
          "name": "Part4",
          "latex": " \\dfrac {\\displaystyle 12} {\\displaystyle 13}",
          "decimal": "0.923076923076923"
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
    "name": "Statistics localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-0301000000+S-001410101000000E1010B000E9F8+T-340034FK0034S40034",
    "fields": [
      "statistic"
    ],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Statistics",
          "subName": "Single-Variable Statistic",
          "mainMode": "03",
          "subMode": "01"
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
        "statistic": {
          "array": [
            [
              "x"
            ],
            [
              "1"
            ],
            [
              "5"
            ],
            [
              "9"
            ]
          ],
          "csv": "x\n1\n5\n9"
        }
      },
      "zh": {
        "mode": {
          "mainName": "统计",
          "subName": "单变量统计",
          "mainMode": "03",
          "subMode": "01"
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
        "statistic": {
          "array": [
            [
              "x"
            ],
            [
              "1"
            ],
            [
              "5"
            ],
            [
              "9"
            ]
          ],
          "csv": "x\n1\n5\n9"
        }
      },
      "vi": {
        "mode": {
          "mainName": "Thống kê",
          "subName": "Thống kê 1 biến",
          "mainMode": "03",
          "subMode": "01"
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
        "statistic": {
          "array": [
            [
              "x"
            ],
            [
              "1"
            ],
            [
              "5"
            ],
            [
              "9"
            ]
          ],
          "csv": "x\n1\n5\n9"
        }
      },
      "fr": {
        "mode": {
          "mainName": "Stats",
          "subName": "Stats à 1 var",
          "mainMode": "03",
          "subMode": "01"
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
        "statistic": {
          "array": [
            [
              "x"
            ],
            [
              "1"
            ],
            [
              "5"
            ],
            [
              "9"
            ]
          ],
          "csv": "x\n1\n5\n9"
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
