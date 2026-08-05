import assert from 'node:assert/strict';
import { test } from 'vitest';

import { assertSetupUnorderedEqual, parse, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Sequence-Mode.md
const cases = [
  {
    "name": "Sequence sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0CA00000+S-401410111000000E1010B00044F2+P-000000000500000100+C-020000000000000001000400000000000000010008000000000000000100000000000000000000000300000000000000010005000000000000000100+E-32FB51A631+G-33FB53A634+T-9C0034FK0034LS00345U00354M0035J200359M00355R0036JM0035HL00363V003659S437",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "EY",
        "id": "091",
        "name": "Graph Light+",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Sequence",
        "mainMode": "0G",
        "subMode": "0C"
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
        "tableRange",
        "sequence"
      ],
      "tableRange": [
        {
          "name": "Start",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "End",
          "latex": "5",
          "decimal": "5"
        }
      ],
      "sequence": {
        "setting": {
          "parameter": [
            {
              "latex": "2",
              "decimal": "2"
            },
            {
              "latex": "4",
              "decimal": "4"
            },
            {
              "latex": "8",
              "decimal": "8"
            },
            {
              "latex": "0",
              "decimal": "0"
            },
            {
              "latex": "3",
              "decimal": "3"
            },
            {
              "latex": "5",
              "decimal": "5"
            }
          ],
          "firstTermIsA0": true,
          "seq1": {
            "type": "uₙ₊₁",
            "firstTerm": "u₀"
          },
          "seq2": {
            "type": "vₙ₊₁",
            "firstTerm": "v₀"
          },
          "displaySum": false,
          "resultHeader": [
            "n",
            "uₙ",
            "vₙ"
          ]
        },
        "definition": [
          {
            "name": "uₙ₊₁",
            "expression": "2 uₙ + 1"
          },
          {
            "name": "u₀",
            "expression": "3"
          },
          {
            "name": "vₙ₊₁",
            "expression": "3 vₙ + 4"
          },
          {
            "name": "v₀",
            "expression": "5"
          }
        ],
        "result": {
          "array": [
            [
              "n",
              "uₙ",
              "vₙ"
            ],
            [
              "0",
              "3",
              "5"
            ],
            [
              "1",
              "7",
              "19"
            ],
            [
              "2",
              "15",
              "61"
            ],
            [
              "3",
              "31",
              "187"
            ],
            [
              "4",
              "63",
              "565"
            ],
            [
              "5",
              "127",
              "1699"
            ]
          ],
          "csv": "n,uₙ,vₙ\n0,3,5\n1,7,19\n2,15,61\n3,31,187\n4,63,565\n5,127,1699"
        }
      }
    }
  },
  {
    "name": "Sequence sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0CA00000+S-401410111000000E1010B00044F2+P-000000000500000100+C-020000000000000001000400000000000000010008000000000000000100010000000000000001000300000000000000010005000000000000000100+E-32FB51A631+G-33FB53A634+T-9C00349C0034FK0034FK0034LS00343400355U00357G00354M00357Q0035J20035QI00359M0035HG00355R00368G0036JM00353N0036HL0036Q500363V00367M003659S4377TIO37",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "EY",
        "id": "091",
        "name": "Graph Light+",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Sequence",
        "mainMode": "0G",
        "subMode": "0C"
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
        "tableRange",
        "sequence"
      ],
      "tableRange": [
        {
          "name": "Start",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "End",
          "latex": "5",
          "decimal": "5"
        }
      ],
      "sequence": {
        "setting": {
          "parameter": [
            {
              "latex": "2",
              "decimal": "2"
            },
            {
              "latex": "4",
              "decimal": "4"
            },
            {
              "latex": "8",
              "decimal": "8"
            },
            {
              "latex": "1",
              "decimal": "1"
            },
            {
              "latex": "3",
              "decimal": "3"
            },
            {
              "latex": "5",
              "decimal": "5"
            }
          ],
          "firstTermIsA0": true,
          "seq1": {
            "type": "uₙ₊₁",
            "firstTerm": "u₀"
          },
          "seq2": {
            "type": "vₙ₊₁",
            "firstTerm": "v₀"
          },
          "displaySum": true,
          "resultHeader": [
            "n",
            "uₙ",
            "Σuₙ",
            "vₙ",
            "Σvₙ"
          ]
        },
        "definition": [
          {
            "name": "uₙ₊₁",
            "expression": "2 uₙ + 1"
          },
          {
            "name": "u₀",
            "expression": "3"
          },
          {
            "name": "vₙ₊₁",
            "expression": "3 vₙ + 4"
          },
          {
            "name": "v₀",
            "expression": "5"
          }
        ],
        "result": {
          "array": [
            [
              "n",
              "uₙ",
              "Σuₙ",
              "vₙ",
              "Σvₙ"
            ],
            [
              "0",
              "3",
              "3",
              "5",
              "5"
            ],
            [
              "1",
              "7",
              "10",
              "19",
              "24"
            ],
            [
              "2",
              "15",
              "25",
              "61",
              "85"
            ],
            [
              "3",
              "31",
              "56",
              "187",
              "272"
            ],
            [
              "4",
              "63",
              "119",
              "565",
              "837"
            ],
            [
              "5",
              "127",
              "246",
              "1699",
              "2536"
            ]
          ],
          "csv": "n,uₙ,Σuₙ,vₙ,Σvₙ\n0,3,3,5,5\n1,7,10,19,24\n2,15,25,61,85\n3,31,56,187,272\n4,63,119,565,837\n5,127,246,1699,2536"
        }
      }
    }
  },
  {
    "name": "Sequence sample 3",
    "url": "http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0CA00000+S-401410111000000E1010B00044F2+P-000000000500000100+C-010000000000000001000400000000000000010008000000000000000100010000000000000001000000000000000000000003000000000000000100+E-FB50A6FB53+G-FB53A6FB50+T-9C00349C00349C00349C0034CG0034LS00349C0034IO0034IO0034420035CG0034340035S400346S0035IO0034500035420035AU0035S400347Q00355K0035GI0035420035BS0035",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "EY",
        "id": "091",
        "name": "Graph Light+",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Sequence",
        "mainMode": "0G",
        "subMode": "0C"
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
        "tableRange",
        "sequence"
      ],
      "tableRange": [
        {
          "name": "Start",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "End",
          "latex": "5",
          "decimal": "5"
        }
      ],
      "sequence": {
        "setting": {
          "parameter": [
            {
              "latex": "1",
              "decimal": "1"
            },
            {
              "latex": "4",
              "decimal": "4"
            },
            {
              "latex": "8",
              "decimal": "8"
            },
            {
              "latex": "1",
              "decimal": "1"
            },
            {
              "latex": "0",
              "decimal": "0"
            },
            {
              "latex": "3",
              "decimal": "3"
            }
          ],
          "firstTermIsA0": true,
          "seq1": {
            "type": "uₙ",
            "firstTerm": null
          },
          "seq2": {
            "type": "vₙ₊₁",
            "firstTerm": "v₀"
          },
          "displaySum": true,
          "resultHeader": [
            "n",
            "uₙ",
            "Σuₙ",
            "vₙ",
            "Σvₙ"
          ]
        },
        "definition": [
          {
            "name": "uₙ",
            "expression": "n + vₙ"
          },
          {
            "name": "vₙ₊₁",
            "expression": "vₙ + n"
          },
          {
            "name": "v₀",
            "expression": "3"
          }
        ],
        "result": {
          "array": [
            [
              "n",
              "uₙ",
              "Σuₙ",
              "vₙ",
              "Σvₙ"
            ],
            [
              "0",
              "3",
              "3",
              "3",
              "3"
            ],
            [
              "1",
              "4",
              "7",
              "3",
              "6"
            ],
            [
              "2",
              "6",
              "13",
              "4",
              "10"
            ],
            [
              "3",
              "9",
              "22",
              "6",
              "16"
            ],
            [
              "4",
              "13",
              "35",
              "9",
              "25"
            ],
            [
              "5",
              "18",
              "53",
              "13",
              "38"
            ]
          ],
          "csv": "n,uₙ,Σuₙ,vₙ,Σvₙ\n0,3,3,3,3\n1,4,7,3,6\n2,6,13,4,10\n3,9,22,6,16\n4,13,35,9,25\n5,18,53,13,38"
        }
      }
    }
  },
  {
    "name": "Sequence sample 4",
    "url": "http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0C000000+S-401410111000000E1010B0003241+P-000000000500000100+C-010000000000000001000400000000000000010009000000000000000100010000000000000001000000000000000000000000000000000000000000+E-FB50A6FB53+G-FB53A6FB50+T-ZF0000ZF0000ZF0000ZF00003400343400340000000000009C0034CG0034340034340034IO00343400359C0034CG0034340035680035IO00343400354M0035AU0035340035680035",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "EY",
        "id": "091",
        "name": "Graph Light+",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Sequence",
        "mainMode": "0G",
        "subMode": "0C"
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
        "tableRange",
        "sequence"
      ],
      "tableRange": [
        {
          "name": "Start",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "End",
          "latex": "5",
          "decimal": "5"
        }
      ],
      "sequence": {
        "setting": {
          "parameter": [
            {
              "latex": "1",
              "decimal": "1"
            },
            {
              "latex": "4",
              "decimal": "4"
            },
            {
              "latex": "9",
              "decimal": "9"
            },
            {
              "latex": "1",
              "decimal": "1"
            },
            {
              "latex": "0",
              "decimal": "0"
            },
            {
              "latex": "0",
              "decimal": "0"
            }
          ],
          "firstTermIsA0": false,
          "seq1": {
            "type": "uₙ",
            "firstTerm": null
          },
          "seq2": {
            "type": "vₙ₊₁",
            "firstTerm": "v₁"
          },
          "displaySum": true,
          "resultHeader": [
            "n",
            "uₙ",
            "Σuₙ",
            "vₙ",
            "Σvₙ"
          ]
        },
        "definition": [
          {
            "name": "uₙ",
            "expression": "n + vₙ"
          },
          {
            "name": "vₙ₊₁",
            "expression": "vₙ + n"
          },
          {
            "name": "v₁",
            "expression": "0"
          }
        ],
        "result": {
          "array": [
            [
              "n",
              "uₙ",
              "Σuₙ",
              "vₙ",
              "Σvₙ"
            ],
            [
              "0",
              "",
              "",
              "",
              ""
            ],
            [
              "1",
              "1",
              "1",
              "0",
              "0"
            ],
            [
              "2",
              "3",
              "4",
              "1",
              "1"
            ],
            [
              "3",
              "6",
              "10",
              "3",
              "4"
            ],
            [
              "4",
              "10",
              "20",
              "6",
              "10"
            ],
            [
              "5",
              "15",
              "35",
              "10",
              "20"
            ]
          ],
          "csv": "n,uₙ,Σuₙ,vₙ,Σvₙ\n0,,,,\n1,1,1,0,0\n2,3,4,1,1\n3,6,10,3,4\n4,10,20,6,10\n5,15,35,10,20"
        }
      }
    }
  },
  {
    "name": "Sequence sample 5",
    "url": "http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0CA00000+S-401510111000000E1010B0004583+P-000000000500000100+C-020000000000000001000400000000000000010008000000000000000100000000000000000000000500000000000000010002000000000000000100+E-32FB51C91A321BA633+G-C81D1A32741AFB531B1B1A351B1EA6FB50C91A321B+T-FK0034680034GI0035HLLD33HI3437422K34JNSG3BDTJD34OUJJ3JUODN343VHH445CH635",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "EY",
        "id": "091",
        "name": "Graph Light+",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Sequence",
        "mainMode": "0G",
        "subMode": "0C"
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
          "code": "1"
        },
        {
          "type": "ANGLE_UNIT",
          "code": "5"
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
        "tableRange",
        "sequence"
      ],
      "tableRange": [
        {
          "name": "Start",
          "latex": "0",
          "decimal": "0"
        },
        {
          "name": "End",
          "latex": "5",
          "decimal": "5"
        }
      ],
      "sequence": {
        "setting": {
          "parameter": [
            {
              "latex": "2",
              "decimal": "2"
            },
            {
              "latex": "4",
              "decimal": "4"
            },
            {
              "latex": "8",
              "decimal": "8"
            },
            {
              "latex": "0",
              "decimal": "0"
            },
            {
              "latex": "5",
              "decimal": "5"
            },
            {
              "latex": "2",
              "decimal": "2"
            }
          ],
          "firstTermIsA0": true,
          "seq1": {
            "type": "uₙ₊₁",
            "firstTerm": "u₀"
          },
          "seq2": {
            "type": "vₙ₊₁",
            "firstTerm": "v₀"
          },
          "displaySum": false,
          "resultHeader": [
            "n",
            "uₙ",
            "vₙ"
          ]
        },
        "definition": [
          {
            "name": "uₙ₊₁",
            "expression": "2 uₙ ^{2}  + 3"
          },
          {
            "name": "u₀",
            "expression": "5"
          },
          {
            "name": "vₙ₊₁",
            "expression": "\\dfrac{\\displaystyle 2 \\sqrt{vₙ} } {\\displaystyle 5}  + n ^{2} "
          },
          {
            "name": "v₀",
            "expression": "2"
          }
        ],
        "result": {
          "array": [
            [
              "n",
              "uₙ",
              "vₙ"
            ],
            [
              "0",
              "5",
              "2"
            ],
            [
              "1",
              "53",
              "0.565685"
            ],
            [
              "2",
              "5621",
              "1.30084"
            ],
            [
              "3",
              "63191200",
              "4.45621"
            ],
            [
              "4",
              "7986270000000000",
              "9.84439"
            ],
            [
              "5",
              "1.27561e+32",
              "17.255"
            ]
          ],
          "csv": "n,uₙ,vₙ\n0,5,2\n1,53,0.565685\n2,5621,1.30084\n3,63191200,4.45621\n4,7986270000000000,9.84439\n5,1.27561e+32,17.255"
        }
      }
    }
  }
];

for (const { name, url, expected } of cases) {
  test(name, () => {
    assertSetupUnorderedEqual(projectResult(parse(url)), expected);
  });
}

// Formula combinations follow the official Graph Light+ Sequences manual.
// Each URL below was generated after executing the calculation in the EY091 emulator.
const generatedSequenceCases = [
  {
    name: 'u recurrence with v explicit formula and non-default range',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0CA00000+S-401410111000000E1010B00044F2+P-100000100400000100+C-020000000000000001000300000000000000010009000000000000000100000000000000000000000100000000000000010000000000000000000000+E-32FB51+G-33+T-3400349C00346800349C0034CG00349C0034P000349C0034',
    start: 1, end: 4, displaySum: false,
    seq1: { type: 'uₙ₊₁', firstTerm: 'u₁' }, seq2: { type: 'vₙ', firstTerm: null },
    definitions: [
      { name: 'uₙ₊₁', expression: '2 uₙ' }, { name: 'u₁', expression: '1' },
      { name: 'vₙ', expression: '3' },
    ],
    u: n => 2 ** (n - 1), v: () => 3,
  },
  {
    name: 'u recurrence only with sum',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0CA00000+S-401410111000000E1010B00044F2+P-100000100400000100+C-020000000000000001000300000000000000010009000000000000000100010000000000000001000100000000000000010000000000000000000000+E-32FB51+G-+T-3400343400346800349C0034CG0034LS0034P000344M0035',
    start: 1, end: 4, displaySum: true,
    seq1: { type: 'uₙ₊₁', firstTerm: 'u₁' }, seq2: { type: 'vₙ', firstTerm: null },
    definitions: [
      { name: 'uₙ₊₁', expression: '2 uₙ' }, { name: 'u₁', expression: '1' },
      { name: 'vₙ', expression: '' },
    ],
    u: n => 2 ** (n - 1),
  },
  {
    name: 'v explicit formula only with sum',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0CA00000+S-401410111000000E1010B00044F2+P-100000100400000100+C-020000000000000001000300000000000000010009000000000000000100010000000000000001000000000000000000000000000000000000000000+E-+G-33+T-9C00349C00349C0034IO00349C0034S400349C00343O0035',
    start: 1, end: 4, displaySum: true,
    seq1: { type: 'uₙ₊₁', firstTerm: 'u₁' }, seq2: { type: 'vₙ', firstTerm: null },
    definitions: [
      { name: 'uₙ₊₁', expression: '' }, { name: 'u₁', expression: '0' },
      { name: 'vₙ', expression: '3' },
    ],
    v: () => 3,
  },
  {
    name: 'two explicit formulas with sums',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0CA00000+S-401410111000000E1010B00044F2+P-100000100400000100+C-010000000000000001000300000000000000010009000000000000000100010000000000000001000000000000000000000000000000000000000000+E-32+G-33+T-6800346800349C00349C0034680034CG00349C0034IO0034680034IO00349C0034S40034680034P000349C00343O0035',
    start: 1, end: 4, displaySum: true,
    seq1: { type: 'uₙ', firstTerm: null }, seq2: { type: 'vₙ', firstTerm: null },
    definitions: [{ name: 'uₙ', expression: '2' }, { name: 'vₙ', expression: '3' }],
    u: () => 2, v: () => 3,
  },
  {
    name: 'mixed formulas with first term at 1 and range including 0',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0C000000+S-401410111000000E1010B0003241+P-000000000300000100+C-020000000000000001000300000000000000010009000000000000000100010000000000000001000100000000000000010000000000000000000000+E-32FB51+G-33+T-ZF0000ZF0000ZF0000ZF00003400343400349C00349C00346800349C00349C0034IO0034CG0034LS00349C0034S40034',
    start: 0, end: 3, displaySum: true,
    seq1: { type: 'uₙ₊₁', firstTerm: 'u₁' }, seq2: { type: 'vₙ', firstTerm: null },
    definitions: [
      { name: 'uₙ₊₁', expression: '2 uₙ' }, { name: 'u₁', expression: '1' },
      { name: 'vₙ', expression: '3' },
    ],
    u: n => 2 ** (n - 1), v: () => 3,
  },
  {
    name: 'u explicit formula only with range including 0',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0C000000+S-401410111000000E1010B0003241+P-000000000300000100+C-010000000000000001000300000000000000010009000000000000000100010000000000000001000000000000000000000000000000000000000000+E-32+G-+T-ZF0000ZF0000680034680034680034CG0034680034IO0034',
    start: 0, end: 3, displaySum: true,
    seq1: { type: 'uₙ', firstTerm: null }, seq2: { type: 'vₙ', firstTerm: null },
    definitions: [{ name: 'uₙ', expression: '2' }, { name: 'vₙ', expression: '' }],
    u: () => 2,
  },
  {
    name: 'v recurrence only with range including 0',
    url: 'http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0G0C000000+S-401410111000000E1010B0003241+P-000000000300000100+C-010000000000000001000400000000000000010009000000000000000100010000000000000001000000000000000000000001000000000000000100+E-+G-33FB53+T-ZF0000ZF00003400343400349C0034CG0034S40034420035',
    start: 0, end: 3, displaySum: true,
    seq1: { type: 'uₙ', firstTerm: null }, seq2: { type: 'vₙ₊₁', firstTerm: 'v₁' },
    definitions: [
      { name: 'uₙ', expression: '' }, { name: 'vₙ₊₁', expression: '3 vₙ' },
      { name: 'v₁', expression: '1' },
    ],
    v: n => 3 ** (n - 1),
  },
];

const sumTerms = (term, first, end) => {
  let sum = 0;
  for (let n = first; n <= end; n++) sum += term(n);
  return sum;
};

const expectedSequenceArray = ({ start, end, displaySum, u, v }) => {
  const header = ['n'];
  if (u) header.push('uₙ', ...(displaySum ? ['Σuₙ'] : []));
  if (v) header.push('vₙ', ...(displaySum ? ['Σvₙ'] : []));
  const array = [header];

  for (let n = start; n <= end; n++) {
    const row = [String(n)];
    for (const term of [u, v]) {
      if (!term) continue;
      if (n < 1) {
        row.push('', ...(displaySum ? [''] : []));
      } else {
        row.push(String(term(n)));
        if (displaySum) row.push(String(sumTerms(term, 1, n)));
      }
    }
    array.push(row);
  }
  return array;
};

for (const sequenceCase of generatedSequenceCases) {
  test('Generated sequence QR: ' + sequenceCase.name, () => {
    const parsed = projectResult(parse(sequenceCase.url));
    const expectedArray = expectedSequenceArray(sequenceCase);

    assert.deepEqual(parsed.tableRange.map(item => item.decimal), [String(sequenceCase.start), String(sequenceCase.end)]);
    assert.equal(parsed.sequence.setting.firstTermIsA0, false);
    assert.equal(parsed.sequence.setting.displaySum, sequenceCase.displaySum);
    assert.deepEqual(parsed.sequence.setting.seq1, sequenceCase.seq1);
    assert.deepEqual(parsed.sequence.setting.seq2, sequenceCase.seq2);
    assert.deepEqual(parsed.sequence.setting.resultHeader, expectedArray[0]);
    assert.deepEqual(parsed.sequence.definition, sequenceCase.definitions);
    assert.deepEqual(parsed.sequence.result.array, expectedArray);
    assert.equal(parsed.sequence.result.csv, expectedArray.map(row => row.join(',')).join('\n'));
  });
}

test('Sequence formula-presence and type combinations are covered', () => {
  const state = url => {
    const parsed = projectResult(parse(url));
    const has = field => new RegExp('\\+' + field + '-([^+]*)').exec(url)?.[1].length > 0;
    const type = value => value.includes('₊₁') ? 'recurrence' : 'explicit';
    return [
      has('E') ? 'u-' + type(parsed.sequence.setting.seq1.type) : 'u-none',
      has('G') ? 'v-' + type(parsed.sequence.setting.seq2.type) : 'v-none',
    ].join('/');
  };
  const covered = new Set([...cases, ...generatedSequenceCases].map(({ url }) => state(url)));

  assert.deepEqual(covered, new Set([
    'u-recurrence/v-recurrence', 'u-explicit/v-recurrence',
    'u-recurrence/v-explicit', 'u-explicit/v-explicit',
    'u-recurrence/v-none', 'u-explicit/v-none',
    'u-none/v-recurrence', 'u-none/v-explicit',
  ]));
});
