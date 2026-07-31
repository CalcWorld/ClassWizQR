import { ParseExpression } from "./expression/index.js";
import { FORCE_MODEL_PREFIX, getModelInfo, MODEL_TYPE, MODEL_TYPE_NAME } from "./model/index.js";
import { ParseMode } from "./mode/index.js";
import {
  ParseDistribution,
  ParseEquation,
  ParseMatrixList,
  ParseSequenceSetting,
  ParseVectorList
} from "./variable/C.js";
import { ParseMathBox, ParseSequencesResult, ParseSpreadsheet, ParseStatistic } from "./variable/T.js";
import { ParseTableRange } from "./variable/P.js";
import { ParseVariableList } from "./variable/V.js";
import { ParseEquationResult, ParseInequalityResult, ParseNumberResult, ParseStatisticResult } from "./variable/R.js";
import { ParseGraph } from "./variable/W.js";
import { ParseSetup } from "./setup/index.js";
import { availableLanguages, loadResource } from "./utils.js";
import { ParseAlgorithm } from './algo/index.js';
import Decimal from 'decimal.js';

const withDecimalMark = (decimalMark, callback) => {
  if (decimalMark !== '0') {
    return callback();
  }

  const previousToString = Decimal.prototype.toString;
  Decimal.prototype.toString = function (...args) {
    return previousToString.call(this, ...args).replace('.', ',');
  };

  try {
    return callback();
  } finally {
    Decimal.prototype.toString = previousToString;
  }
};

const getRawQueryParameter = (query, name) => {
  const queryStart = query.indexOf('?');
  if (queryStart === -1) return;

  for (const parameter of query.slice(queryStart + 1).split('&')) {
    const separator = parameter.indexOf('=');
    const key = separator === -1 ? parameter : parameter.slice(0, separator);
    if (decodeURIComponent(key) === name) {
      return separator === -1 ? '' : parameter.slice(separator + 1);
    }
  }
};

const parseQrPayload = (rawPayload) => {
  const payload = decodeURIComponent(rawPayload);

  return payload.split(/[+\s]+/).reduce((acc, field) => {
    const separator = field.indexOf('-');
    if (separator > 0) {
      acc[field.slice(0, separator)] = field.slice(separator + 1);
    }
    return acc;
  }, {});
};

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
      W: void 0,
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
    const { hash, search, pathname } = this.url;
    const route = pathname.slice(0, 5);
    let modelType;
    let kv = {}

    const isGetStartedRoute = route === '/calc';
    if (isGetStartedRoute) {
      const calcId = pathname.slice(9);
      this.setCalcId(calcId);
      kv.I = calcId.slice(0, 4);
      kv.U = calcId.slice(4, 16);
    } else {
      let payload = getRawQueryParameter(search, 'q');
      if (payload === undefined) {
        payload = getRawQueryParameter(hash, 'qr');
      }
      kv = parseQrPayload(payload);
    }

    const modelId = +kv.I?.slice(0, 3);
    const isExRoute = route === '/math';
    const isCwRoute = isGetStartedRoute || route === '/ncal';
    const isEyModel = modelId <= 90;
    const isFyModel = modelId === 91 || modelId >= 500;

    if (isExRoute) {
      modelType = MODEL_TYPE.CY;
    } else if (isCwRoute) {
      modelType = isFyModel ? MODEL_TYPE.FY : MODEL_TYPE.EY;
    } else {
      modelType = isFyModel ? MODEL_TYPE.FY : isEyModel ? MODEL_TYPE.EY : MODEL_TYPE.CY;
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
    const decimalMark = this.kv.S
      ? new ParseSetup(this.kv).getDecimalMark()
      : undefined;
    return withDecimalMark(decimalMark, () => this.#getResult());
  }

  #getResult() {
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
      _parseM = new ParseMode(kv);
      mode = _parseM.getModeInfo(modelType, modelId);
      _mainMode = _parseM.getMainMode();
      format = _parseM.getFormatInfo();
    } else if (calcId) {
      mode = new ParseMode({}).getGetStarted()
    }

    let setup;
    if (kv.S) {
      const parseS = new ParseSetup(kv);
      setup = parseS.parseAll(modelType);
    }

    let expression, expressionE, expressionG, _function, algorithm, graph;
    let sequence, _sequenceDef;
    if (kv.E) {
      if (_mainMode === '0E') {
        const parseE = new ParseAlgorithm(kv, { modelType, modelId });
        algorithm = parseE.parseAll();
      } else {
        const parseE = new ParseExpression(kv, { modelType, modelId });
        if (kv.M && kv.S) {
          expressionE = parseE.autoParse(kv);
        } else {
          expressionE = parseE.parseMath();
        }
      }
    }
    if (kv.G) {
      const parseG = new ParseExpression({ E: kv.G }, { modelType, modelId });
      if (kv.M && kv.S) {
        expressionG = parseG.autoParse(kv);
      } else {
        expressionG = parseG.parseMath();
      }
    }
    if (['88', '09'].includes(_mainMode)) {
      _function = [
        { name: 'f(x)', expression: expressionE || '' },
        { name: 'g(x)', expression: expressionG || '' },
      ];
    } else if ('0G' === _mainMode) {
      _sequenceDef = [
        expressionE || '',
        expressionG || '',
      ];
    } else {
      expression = expressionE;
    }
    if (_mainMode === '09' && kv.W) {
      graph = ParseGraph(kv);
    }

    let tableRange;
    if (kv.P) {
      tableRange = ParseTableRange(kv);
    }

    let result;
    const R = kv.R || kv.Q;
    if (R) {
      const resultKv = { ...kv, R };
      const typeCode = R.slice(0, 2);
      switch (typeCode) {
        case 'MT':
          result = ParseMatrixList({ C: R, S: kv.S });
          break;
        case 'VT':
          result = ParseVectorList({ C: R, S: kv.S });
          break;
        case 'EQ':
          result = ParseEquationResult(resultKv);
          break;
        case 'IN':
          result = ParseInequalityResult(resultKv);
          break;
        default:
          if (_mainMode === '03' && _parseM.getResultTemplate().startsWith('F')) {
            result = ParseStatisticResult(resultKv, { modelType, modelId });
          } else {
            result = ParseNumberResult(resultKv, { modelType, modelId });
          }
      }
    }

    // variable in Table mode, create table based on variable if the formula contains variable
    let variable;
    if (kv.V) {
      variable = ParseVariableList(kv, { modelType });
    }

    // in Vector or Matrix mode, any calculate contains its defined vector/matrix in C
    // in Equation, Inequality or Ratio mode, it's the entered coefficients
    // in Distribution mode, it's the entered data
    // in MathBox mode, it's the dice/coin number, attempts and relative frequency type (sum/diff) in Dice Roll
    // in Sequence mode, it's the settings parameter of sequence mode (perhaps S is full so it uses C instead)
    let vector, matrix, equation, distribution;
    if (kv.C) {
      if (kv.C.startsWith('M')) {
        matrix = ParseMatrixList(kv);
      } else if (kv.C.startsWith('V')) {
        vector = ParseVectorList(kv);
      } else if (kv.M) {
        if (['45', '4A', '4B'].includes(_mainMode)) {
          equation = ParseEquation(kv);
        } else if (_mainMode === '0C') {
          distribution = ParseDistribution(kv);
        } else if (_mainMode === '0G') {
          const seq = ParseSequenceSetting(kv);
          sequence = {};
          sequence['setting'] = seq;
          sequence['definition'] = [
            { name: seq.seq1.type, expression: _sequenceDef[0] },
            { name: seq.seq1.firstTerm, expression: seq.parameter[4].latex },
            { name: seq.seq2.type, expression: _sequenceDef[1] },
            { name: seq.seq2.firstTerm, expression: seq.parameter[5].latex },
          ].filter(({ name }) => Boolean(name));
        }
      }
    }

    let spreadsheet, statistic, mathBox;
    if (kv.T) {
      if (kv.T.startsWith('SP')) {
        spreadsheet = ParseSpreadsheet(kv);
      } else if (_mainMode === '4F') {
        mathBox = ParseMathBox(kv);
      } else if (_mainMode === '0G') {
        sequence['result'] = ParseSequencesResult(kv, { sequence, tableRange });
      } else {
        statistic = ParseStatistic(kv);
      }
    }

    return {
      model: {
        type: MODEL_TYPE_NAME[modelType],
        // fuck casio
        prefix: FORCE_MODEL_PREFIX[modelId] ?? modelType,
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
      graph,
      sequence,
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
