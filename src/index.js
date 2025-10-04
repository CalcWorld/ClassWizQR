import { ParseExpression } from "./expression/index.js";
import { getModelInfo, MODEL_PREFIX, MODEL_TYPE, MODEL_TYPE_NAME } from "./model/index.js";
import { ParseMode } from "./mode/index.js";
import { ParseDistribution, ParseEquation, ParseMatrixList, ParseVectorList } from "./variable/C.js";
import { ParseMathBox, ParseSpreadsheet, ParseStatistic } from "./variable/T.js";
import { ParseTableRange } from "./variable/P.js";
import { ParseVariableList } from "./variable/V.js";
import { ParseEquationResult, ParseInequalityResult, ParseNumberResult, ParseStatisticResult } from "./variable/R.js";
import { ParseSetup } from "./setup/index.js";
import { availableLanguages } from "./utils.js";
import { ParseAlgorithm } from './algo/index.js';

export class ClassWizQR {
  constructor() {
    this.url = void 0;
    this.modelType = void 0;
    this.modelPrefix = void 0;
    this.kv = {
      I: void 0,
      U: void 0,
      M: void 0,
      S: void 0,
      R: void 0,
      E: void 0,
      T: void 0,
      C: void 0,
      G: void 0,
      P: void 0,
      V: void 0,
      Q: void 0,
    };
    this.language = 'en';
    globalThis.cwqrConfig = {};
  }

  setUrl(url, language) {
    this.url = new URL(url.trim());
    const { search, pathname } = this.url;
    const modelType = pathname.slice(0, 5) === '/ncal' ? MODEL_TYPE.EY : MODEL_TYPE.CY;
    const kv = search.slice(3).split('+').reduce((acc, cur) => {
      const [k, v] = cur.split('-');
      acc[k] = v;
      return acc;
    }, {});
    let modelPrefix;
    if (modelType === MODEL_TYPE.EY) {
      modelPrefix = MODEL_PREFIX.EY;
      if (kv.I?.slice(0, 3) > 500) {
        modelPrefix = MODEL_PREFIX.FY;
      }
    } else {
      modelPrefix = MODEL_PREFIX.CY;
    }
    language = availableLanguages.includes(language) ? language : 'en'
    this.setModelType(modelType)
      .setModelPrefix(modelPrefix)
      .setKV(kv)
      .setLanguage(language);
    return this;
  }

  setModelType(modelType) {
    this.modelType = modelType;
    return this;
  }

  setModelPrefix(modelPrefix) {
    this.modelPrefix = modelPrefix;
    return this;
  }

  setKV(kv) {
    this.kv = kv;
    return this;
  }

  setLanguage(language) {
    this.language = language;
    globalThis.cwqrConfig.language = this.language;
    return this;
  }

  getResult() {
    const { modelType, modelPrefix, kv } = this;
    let modelId, modelName, qr, modelVersion;
    if (kv.I) {
      modelId = kv.I.slice(0, 3);
      [modelName, qr] = getModelInfo(modelId, modelType);
      modelVersion = kv.I.slice(3, 4);
    }

    const serialNumber = kv.U;

    let _parseM, mode, _mainMode;
    if (kv.M) {
      _parseM = new ParseMode(kv.M);
      mode = _parseM.getModeInfo();
      _mainMode = _parseM.getMainMode();
    }

    let setup;
    if (kv.S) {
      const parseS = new ParseSetup(kv.S);
      setup = parseS.parseAll();
    }

    let expression, expressionE, expressionG, _function, algorithm;
    if (kv.E) {
      if (_mainMode === '0E') {
        const parseE = new ParseAlgorithm(kv.E, modelType, modelId);
        algorithm = {
          latexCommand: parseE.parseToLaTexCmdList(),
          scratchblocks: parseE.parseToScratch(),
        };
      } else {
        const parseE = new ParseExpression(kv.E, modelType, modelId);
        if (kv.M && kv.S) {
          expressionE = parseE.autoParse(kv.M, kv.S);
        } else {
          expressionE = parseE.parseMath();
        }
      }
    }
    if (kv.G) {
      const parseG = new ParseExpression(kv.G, modelType, modelId);
      if (kv.M && kv.S) {
        expressionG = parseG.autoParse(kv.M, kv.S);
      } else {
        expressionG = parseG.parseMath();
      }
    }
    if (['88', '09'].includes(_mainMode)) {
      _function = [
        { name: 'f(x)', expression: expressionE || '' },
        { name: 'g(x)', expression: expressionG || '' },
      ];
    } else {
      expression = expressionE;
    }

    let tableRange;
    if (kv.P) {
      tableRange = ParseTableRange(kv.P);
    }

    let result;
    const R = kv.R || kv.Q;
    if (R) {
      const typeCode = R.slice(0, 2);
      switch (typeCode) {
        case 'MT':
          result = ParseMatrixList(R);
          break;
        case 'VT':
          result = ParseVectorList(R);
          break;
        case 'EQ':
          result = ParseEquationResult(R, kv.M, kv.S, kv.C);
          break;
        case 'IN':
          result = ParseInequalityResult(R);
          break;
        default:
          if (_mainMode === '03' && _parseM.getResultTemplate().startsWith('F')) {
            result = ParseStatisticResult(R, kv.M);
          } else {
            result = ParseNumberResult(R, kv.M, modelType, modelId);
          }
      }
    }

    // variable in Table mode, create table based on variable if the formula contains variable
    let variable;
    if (kv.V) {
      variable = ParseVariableList(kv.V, modelType);
    }

    // any calculate in Vector or Matrix contains its defined vector or matrix in C
    // in Equation, Inequality or Ratio mode, it's the entered coefficients
    // in Distribution mode, it's the entered data
    // in MathBox mode, it's the dice/coin number, attempts and relative frequency type (sum/diff) in Dice Roll
    let vector, matrix, equation, distribution;
    if (kv.C) {
      if (kv.C.startsWith('M')) {
        matrix = ParseMatrixList(kv.C);
      } else if (kv.C.startsWith('V')) {
        vector = ParseVectorList(kv.C);
      } else if (kv.M) {
        if (['45', '4A', '4B'].includes(_mainMode)) {
          equation = ParseEquation(kv.M, kv.C);
        } else if (_mainMode === '0C') {
          distribution = ParseDistribution(kv.M, kv.C);
        }
      }
    }

    let spreadsheet, statistic, mathBox;
    if (kv.T) {
      if (kv.T.startsWith('SP')) {
        spreadsheet = ParseSpreadsheet(kv.T);
      } else if (_mainMode === '4F') {
        mathBox = ParseMathBox(kv.T, kv.M, kv.C);
      } else {
        statistic = ParseStatistic(kv.T, kv.M, kv.S);
      }
    }

    return {
      model: {
        type: MODEL_TYPE_NAME[modelType],
        prefix: modelPrefix,
        id: modelId,
        name: modelName,
        version: modelVersion,
        qr,
        serialNumber,
      },
      mode,
      expression,
      function: _function,
      equation,
      tableRange,
      result,
      variable,
      vector,
      matrix,
      spreadsheet,
      statistic,
      distribution,
      mathBox,
      algorithm,
      setup,
    };
  }

}

export const parseUrl = (url, lang) => {
  const cwqr = new ClassWizQR();
  return cwqr.setUrl(url, lang).getResult();
};

export { availableLanguages } from "./utils.js";
