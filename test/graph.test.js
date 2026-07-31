import assert from 'node:assert/strict';
import { test } from 'vitest';

import { parse, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Graph-Mode.md
const cases = [
  {
    "name": "Graph sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0900000000+S-401510111000000E1010B0002AFD+W-100000100100000100000000000000000000+V-400000099600000099500000099000000000000000000000000000000000000000000000+E-7747D0A641+G-427847D0A643",
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
        "mainName": "Graph",
        "mainMode": "09",
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
        "function",
        "graph",
        "variable"
      ],
      "function": [
        {
          "name": "f(x)",
          "expression": "\\sin( x ) + \\mathrm{A}"
        },
        {
          "name": "g(x)",
          "expression": "\\mathrm{B} \\cos( x ) + \\mathrm{C}"
        }
      ],
      "graph": [
        {
          "name": "f(x)",
          "value": "Enabled",
          "type": "FX_ENABLED",
          "code": "1"
        },
        {
          "name": "g(x)",
          "value": "Enabled",
          "type": "GX_ENABLED",
          "code": "1"
        },
        {
          "name": "Reserved Value 1",
          "value": "0",
          "type": "RESERVED_VALUE_1",
          "code": "0"
        },
        {
          "name": "Reserved Value 2",
          "value": "0",
          "type": "RESERVED_VALUE_2",
          "code": "0"
        }
      ],
      "variable": [
        {
          "name": "A",
          "latex": "0.4",
          "decimal": "0.4"
        },
        {
          "name": "B",
          "latex": "0.6",
          "decimal": "0.6"
        },
        {
          "name": "C",
          "latex": "0.5",
          "decimal": "0.5"
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
  },
  {
    "name": "Graph sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0900000000+S-401510111000000E1010B0002AFD+W-100000100000000000000000000000000000+E-C81D1A741A471B1B1A32471B1EA67D1A321C471B+G-",
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
        "mainName": "Graph",
        "mainMode": "09",
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
        "function",
        "graph"
      ],
      "function": [
        {
          "name": "f(x)",
          "expression": "\\dfrac{\\displaystyle \\sqrt{x} } {\\displaystyle 2 x}  + \\log_{2}{(x)} "
        },
        {
          "name": "g(x)",
          "expression": ""
        }
      ],
      "graph": [
        {
          "name": "f(x)",
          "value": "Enabled",
          "type": "FX_ENABLED",
          "code": "1"
        },
        {
          "name": "g(x)",
          "value": "Disabled",
          "type": "GX_ENABLED",
          "code": "0"
        },
        {
          "name": "Reserved Value 1",
          "value": "0",
          "type": "RESERVED_VALUE_1",
          "code": "0"
        },
        {
          "name": "Reserved Value 2",
          "value": "0",
          "type": "RESERVED_VALUE_2",
          "code": "0"
        }
      ]
    }
  },
  {
    "name": "Graph sample 3",
    "url": "http://wes.casio.com/ncal/index.php?q=I-091A+U-000000000000+M-0900000000+S-401510111000000E1010B0002AFD+W-000000000100000100000000000000000000+E-+G-47C91A341BA647C91A331BA647C91A321BA63247",
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
        "mainName": "Graph",
        "mainMode": "09",
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
        "function",
        "graph"
      ],
      "function": [
        {
          "name": "f(x)",
          "expression": ""
        },
        {
          "name": "g(x)",
          "expression": "x ^{4}  + x ^{3}  + x ^{2}  + 2 x"
        }
      ],
      "graph": [
        {
          "name": "f(x)",
          "value": "Disabled",
          "type": "FX_ENABLED",
          "code": "0"
        },
        {
          "name": "g(x)",
          "value": "Enabled",
          "type": "GX_ENABLED",
          "code": "1"
        },
        {
          "name": "Reserved Value 1",
          "value": "0",
          "type": "RESERVED_VALUE_1",
          "code": "0"
        },
        {
          "name": "Reserved Value 2",
          "value": "0",
          "type": "RESERVED_VALUE_2",
          "code": "0"
        }
      ]
    }
  }
];

for (const { name, url, expected } of cases) {
  test(name, () => {
    assert.deepEqual(projectResult(parse(url)), expected);
  });
}

test('Graph metadata is localized', () => {
  assert.deepEqual(
    parse(cases[0].url, 'zh').graph.map(({ name, value }) => ({ name, value })),
    [
      { name: 'f(x)', value: '启用' },
      { name: 'g(x)', value: '启用' },
      { name: '保留值 1', value: '0' },
      { name: '保留值 2', value: '0' },
    ],
  );
});

test('Graph metadata parses every complete block available', () => {
  const url = cases[0].url.replace(/W-[^+]+/, 'W-100000100');
  assert.deepEqual(parse(url).graph, [
    {
      name: 'f(x)',
      value: 'Enabled',
      type: 'FX_ENABLED',
      code: '1',
    },
  ]);
});

test('Graph metadata creates reserved values dynamically', () => {
  const url = cases[0].url.replace(
    /W-[^+]+/,
    'W-100000100000000000200000100300000100100000100',
  );
  assert.deepEqual(parse(url).graph.slice(2), [
    {
      name: 'Reserved Value 1',
      value: '2',
      type: 'RESERVED_VALUE_1',
      code: '2',
    },
    {
      name: 'Reserved Value 2',
      value: '3',
      type: 'RESERVED_VALUE_2',
      code: '3',
    },
    {
      name: 'Reserved Value 3',
      value: '1',
      type: 'RESERVED_VALUE_3',
      code: '1',
    },
  ]);
});
