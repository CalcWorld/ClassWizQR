import assert from 'node:assert/strict';
import { test } from 'vitest';

import { assertSetupUnorderedEqual, parse, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Complex-Mode.md
const cases = [
  {
    "name": "Complex sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-C40000DD47+S-001410101000000E1010B0005638+Q-80030102000501060000000001018000000100070102000000000001+E-C81D1A741A331BA6741A371B201B1A321B1EA6C81D1A741A351B1B1A361B1E",
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
        "mainName": "Complex",
        "mainMode": "C4",
        "subMode": "00"
      },
      "format": {
        "displayName": "Standard",
        "storeName": "Standard",
        "displayCode": "D",
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
        "expression",
        "result"
      ],
      "expression": "\\dfrac{\\displaystyle \\sqrt{3}  + \\sqrt{7}  i} {\\displaystyle 2}  + \\dfrac{\\displaystyle \\sqrt{5} } {\\displaystyle 6} ",
      "result": [
        {
          "name": "templated",
          "latex": " \\dfrac { \\displaystyle  3 \\sqrt{3} +  \\sqrt{5}  } {\\displaystyle 6}  + \\dfrac {\\displaystyle  \\sqrt{7} } {\\displaystyle 2}i"
        },
        {
          "name": "Part1",
          "latex": " \\dfrac { \\displaystyle  3 \\sqrt{3} +  \\sqrt{5}  } {\\displaystyle 6}",
          "decimal": "1.2387034000344035962"
        },
        {
          "name": "Part2",
          "latex": "\\dfrac {\\displaystyle  \\sqrt{7} } {\\displaystyle 2}",
          "decimal": "1.3228756555322952953"
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

test('wraps a compound imaginary coefficient in parentheses', () => {
  const url = 'http://wes.casio.com/math/index.php?q=I-251F+U-000000000000+M-C40000DD00+S-000410101000100E1010B00023EB+R-8000000100050101000180020201000701010106+E-741A381B20A6C81D1A741A371B1B1A201B1EA6741A351B';
  const result = parse(url).result;

  assert.ok(result[0].latex.includes(')i'));
});

test('does not wrap a fractional imaginary coefficient in parentheses', () => {
  const url = 'http://wes.casio.com/math/index.php?q=I-234F+U-000000000000+M-C40000DD00+S-000410100000100E1010B00018C2+R-0000000000000000000080010803000201030101+E-C81D1A741A321BA6381B1A331B1E20';
  const result = parse(url).result;

  assert.ok(!result[0].latex.includes(')i'));
});
