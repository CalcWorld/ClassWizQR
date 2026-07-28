import assert from 'node:assert/strict';
import { test } from 'vitest';

import { parse, projectLocalization, projectResult } from './support/parser.js';

// Sources: ../ClassWizQR.wiki/Errors,-Manual,-Get-Started-Screen.md
const cases = [
  {
    "name": "Errors and pages sample 1",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-X100000000+S-0CCE2",
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
        "mainName": "Calculate Manual",
        "mainMode": "X1"
      },
      "format": {
        "displayName": "Not Specified",
        "storeName": "Not Specified",
        "displayCode": "0",
        "storeCode": "0"
      },
      "setup": [
        {
          "type": "LANGUAGE",
          "code": "0"
        }
      ],
      "semanticFields": []
    }
  },
  {
    "name": "Errors and pages sample 2",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-Y200000000+S-0040F",
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
        "mainName": "Syntax ERROR",
        "mainMode": "Y2"
      },
      "format": {
        "displayName": "Not Specified",
        "storeName": "Not Specified",
        "displayCode": "0",
        "storeCode": "0"
      },
      "setup": [
        {
          "type": "LANGUAGE",
          "code": "0"
        }
      ],
      "semanticFields": []
    }
  },
  {
    "name": "Errors and pages sample 3",
    "url": "https://wes.casio.com/calc/cw/523A0000000000000000B4BF",
    "expected": {
      "model": {
        "type": "ClassWiz CW 2nd edition",
        "prefix": "FY",
        "id": "523",
        "name": "fx-880BTG PLUS",
        "version": "A",
        "qr": 2,
        "serialNumber": "000000000000"
      },
      "mode": {
        "mainName": "Get Started Screen"
      },
      "semanticFields": []
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
    "name": "Manual page localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-X100000000+S-0CCE2",
    "fields": [],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Calculate Manual",
          "mainMode": "X1"
        },
        "format": {
          "displayName": "Not Specified",
          "storeName": "Not Specified",
          "displayCode": "0",
          "storeCode": "0"
        },
        "setup": [
          {
            "name": "Language",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          }
        ]
      },
      "zh": {
        "mode": {
          "mainName": "计算模式说明",
          "mainMode": "X1"
        },
        "format": {
          "displayName": "未指定",
          "storeName": "未指定",
          "displayCode": "0",
          "storeCode": "0"
        },
        "setup": [
          {
            "name": "语言",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          }
        ]
      },
      "vi": {
        "mode": {
          "mainName": "Mô tả Phép tính thường",
          "mainMode": "X1"
        },
        "format": {
          "displayName": "Không chỉ định",
          "storeName": "Không chỉ định",
          "displayCode": "0",
          "storeCode": "0"
        },
        "setup": [
          {
            "name": "Ngôn ngữ",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          }
        ]
      },
      "fr": {
        "mode": {
          "mainName": "Manuel de Calcul",
          "mainMode": "X1"
        },
        "format": {
          "displayName": "Non spécifié",
          "storeName": "Non spécifié",
          "displayCode": "0",
          "storeCode": "0"
        },
        "setup": [
          {
            "name": "Langue",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          }
        ]
      }
    }
  },
  {
    "name": "Error page localization",
    "url": "http://wes.casio.com/ncal/index.php?q=I-505A+U-000000000000+M-Y200000000+S-0040F",
    "fields": [],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Syntax ERROR",
          "mainMode": "Y2"
        },
        "format": {
          "displayName": "Not Specified",
          "storeName": "Not Specified",
          "displayCode": "0",
          "storeCode": "0"
        },
        "setup": [
          {
            "name": "Language",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          }
        ]
      },
      "zh": {
        "mode": {
          "mainName": "语法错误",
          "mainMode": "Y2"
        },
        "format": {
          "displayName": "未指定",
          "storeName": "未指定",
          "displayCode": "0",
          "storeCode": "0"
        },
        "setup": [
          {
            "name": "语言",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          }
        ]
      },
      "vi": {
        "mode": {
          "mainName": "Lỗi cú pháp",
          "mainMode": "Y2"
        },
        "format": {
          "displayName": "Không chỉ định",
          "storeName": "Không chỉ định",
          "displayCode": "0",
          "storeCode": "0"
        },
        "setup": [
          {
            "name": "Ngôn ngữ",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          }
        ]
      },
      "fr": {
        "mode": {
          "mainName": "ERREUR de syntaxe",
          "mainMode": "Y2"
        },
        "format": {
          "displayName": "Non spécifié",
          "storeName": "Non spécifié",
          "displayCode": "0",
          "storeCode": "0"
        },
        "setup": [
          {
            "name": "Langue",
            "value": "0",
            "type": "LANGUAGE",
            "code": "0"
          }
        ]
      }
    }
  },
  {
    "name": "Get Started localization",
    "url": "https://wes.casio.com/calc/cw/523A0000000000000000B4BF",
    "fields": [],
    "expected": {
      "en": {
        "mode": {
          "mainName": "Get Started Screen"
        }
      },
      "zh": {
        "mode": {
          "mainName": "开始屏幕"
        }
      },
      "vi": {
        "mode": {
          "mainName": "Màn hình \"Get Started\" của máy tính"
        }
      },
      "fr": {
        "mode": {
          "mainName": "Écran « Mode d’emploi »"
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
