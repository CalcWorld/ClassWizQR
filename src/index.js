import { ParseExpression } from "./expression/index.js";
import { getModelInfo, MODEL_TYPE, MODEL_TYPE_NAME } from "./model/index.js";
import { ParseMode } from "./mode/index.js";
import { ParseDistribution, ParseEquation, ParseMatrixList, ParseVectorList } from "./variable/C.js";
import { ParseMathBox, ParseSpreadsheet, ParseStatistic } from "./variable/T.js";
import { ParseTableRange } from "./variable/P.js";
import { ParseVariableList } from "./variable/V.js";
import { ParseEquationResult, ParseInequalityResult, ParseNumberResult, ParseStatisticResult } from "./variable/R.js";
import { ParseSetup } from "./setup/index.js";
import { availableLanguages, loadResource } from "./utils.js";
import { ParseAlgorithm } from './algo/index.js';

export class ClassWizQR {
  constructor() {
    this.url = void 0;
    this.modelType = void 0;
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
    this.calcId = void 0;
    this.language = 'en';
    globalThis.i18nResource = {};
    globalThis.cwqrConfig = {};
  }

  /**
   * @param {string} url
   * @return {ClassWizQR}
   */
  setUrl(url) {
    this.url = new URL(url.trim());
    const { search, pathname } = this.url;
    const route = pathname.slice(0, 5);
    let modelType;
    let kv = {}
    if (route === '/calc') {
      modelType = MODEL_TYPE.EY;
      const calcId = pathname.slice(9);
      this.setCalcId(calcId);
      kv.I = calcId.slice(0, 4);
      kv.U = calcId.slice(4, 16);
    } else {
      if (route === '/math') {
        modelType = MODEL_TYPE.CY;
      } else if (route === '/ncal') {
        modelType = MODEL_TYPE.EY;
      }
      kv = search.slice(3).split('+').reduce((acc, cur) => {
        const [k, v] = cur.split('-');
        acc[k] = v;
        return acc;
      }, {});
    }

    if (modelType === MODEL_TYPE.EY) {
      if (kv.I?.slice(0, 3) > 500) modelType = MODEL_TYPE.FY;
    }

    this.setModelType(modelType).setKV(kv);
    return this;
  }

  setModelType(modelType) {
    this.modelType = modelType;
    return this;
  }

  setKV(kv) {
    this.kv = kv;
    return this;
  }

  setCalcId(calcId) {
    this.calcId = calcId;
    return this;
  }

  setLanguage(language) {
    this.language = availableLanguages.includes(language) ? language : 'en';
    globalThis.cwqrConfig.language = this.language;
    return this;
  }

  /**
   * @param {object} resources
   * @return {ClassWizQR}
   */
  setI18nResource(resources) {
    for (const [language, resource] of Object.entries(resources)) {
      loadResource(language, resource);
    }
    return this;
  }

  getResult() {
    const { modelType, kv, calcId } = this;
    let modelId, modelName, qr, modelVersion;
    if (kv.I) {
      modelId = kv.I.slice(0, 3);
      [modelName, qr] = getModelInfo(modelType, modelId);
      modelVersion = kv.I.slice(3, 4);
    }

    const serialNumber = kv.U;

    let _parseM, mode, _mainMode, format;
    if (kv.M) {
      _parseM = new ParseMode(kv.M);
      mode = _parseM.getModeInfo(modelType, modelId);
      _mainMode = _parseM.getMainMode();
      format = _parseM.getFormatInfo();
    } else if (calcId) {
      mode = new ParseMode().getGetStarted()
    }

    let setup;
    if (kv.S) {
      const parseS = new ParseSetup(kv.S);
      setup = parseS.parseAll(modelType);
    }

    let expression, expressionE, expressionG, _function, algorithm;
    if (kv.E) {
      if (_mainMode === '0E') {
        const parseE = new ParseAlgorithm(kv.S, kv.E, modelType, modelId);
        algorithm = parseE.parseAll();
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
          result = ParseMatrixList(R, kv.S);
          break;
        case 'VT':
          result = ParseVectorList(R, kv.S);
          break;
        case 'EQ':
          result = ParseEquationResult(R, kv.M, kv.S, kv.C);
          break;
        case 'IN':
          result = ParseInequalityResult(R, kv.M);
          break;
        default:
          if (_mainMode === '03' && _parseM.getResultTemplate().startsWith('F')) {
            result = ParseStatisticResult(R, kv.M, modelType, modelId);
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
        matrix = ParseMatrixList(kv.C, kv.S);
      } else if (kv.C.startsWith('V')) {
        vector = ParseVectorList(kv.C, kv.S);
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
        prefix: modelType,
        id: modelId,
        name: modelName,
        version: modelVersion,
        qr,
        serialNumber,
      },
      mode,
      format,
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
      kv,
    };
  }

}

/**
 *
 * @param {string} url
 * @param {string} [lang]
 * @param {object} [i18nRes]
 */
export const parseUrl = (url, lang, i18nRes) => {
  const cwqr = new ClassWizQR();
  if (lang && i18nRes && i18nRes[lang]) {
    cwqr.setLanguage(lang).setI18nResource(i18nRes);
  } else {
    cwqr.setLanguage('en');
    console.warn('Language not specified. Fallback to en.');
  }
  return cwqr.setUrl(url).getResult();
};

export { availableLanguages } from "./utils.js";
