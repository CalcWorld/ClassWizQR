import { ParseExpression } from "./expression/index.js";
import { getModelInfo, MODEL_TYPE } from "./model/index.js";
import { ParseMode } from "./mode/index.js";
import { ParseDistribution, ParseEquation, ParseMatrixList, ParseVectorList } from "./variable/C.js";
import { ParseSpreadsheet, ParseStatistic } from "./variable/T.js";
import { ParseTableRange } from "./variable/P.js";
import { ParseVariableList } from "./variable/V.js";
import { ParseEquationResult, ParseInequalityResult, ParseNumberResult, ParseStatisticResult } from "./variable/R.js";
import { ParseSetup } from "./setup/index.js";

export const availableLanguages = ['zh', 'en', 'vi'];

export class ClassWizQR {
  constructor() {
    this.url = undefined;
    this.modelType = undefined;
    this.kv = {
      I: undefined,
      U: undefined,
      M: undefined,
      S: undefined,
      R: undefined,
      E: undefined,
      T: undefined,
      C: undefined,
      G: undefined,
      P: undefined,
      V: undefined,
      Q: undefined,
    };
    this.language = 'en';
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
    this.setModelType(modelType);
    this.setKV(kv);
    availableLanguages.includes(language) ? this.setLanguage(language) : this.setLanguage('en');
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

  setLanguage(language) {
    this.language = language;
    return this;
  }

  getResult() {
    const { modelType, kv } = this;
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

    let expression;
    if (kv.E) {
      const parseE = new ParseExpression(kv.E, modelType, modelId);
      // TODO: parse Algo
      if (kv.M && kv.S) {
        expression = parseE.autoParse(kv.M, kv.S);
      } else {
        expression = parseE.parseMath();
      }
    }
    if (kv.G) {
      const parseG = new ParseExpression(kv.G, modelType, modelId);
      let expr2;
      if (kv.M && kv.S) {
        expr2 = parseG.autoParse(kv.M, kv.S);
      } else {
        expr2 = parseG.parseMath();
      }
      expression = `f(x)=${expression} \\\\ g(x)=${expr2}`;
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
    // in MathBox mode, it's the dice/coin number and attempts
    let vector, matrix, equation, distribution, mathBox;
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
        } else if (_mainMode === '4F') {
          // TODO: MathBox Mode input
        }
      }
    }

    let spreadsheet, statistic
    if (kv.T) {
      if (kv.T.startsWith('SP')) {
        spreadsheet = ParseSpreadsheet(kv.T);
      } else {
        statistic = ParseStatistic(kv.T, kv.M, kv.S);
      }
    }

    const qrResult = {
      model: {
        type: modelType,
        id: modelId,
        name: modelName,
        version: modelVersion,
        qr,
        serialNumber,
      },
      mode,
      expression,
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
      setup,
    };
    extractLang(qrResult, this.language);
    return qrResult;
  }

}

export const parseUrl = (url, lang) => {
  const cwqr = new ClassWizQR();
  return cwqr.setUrl(url, lang).getResult();
}

function extractLang(resultObject, lang) {
  for (const resKey in resultObject) {
    const resValue = resultObject[resKey];
    if (typeof resValue === 'object') {
      if (resValue[0] && resValue[0].language && resValue[0].name) {
        let langMatch = false;
        for (const valueElement of resValue) {
          if (valueElement.language === lang) {
            resultObject[resKey] = valueElement.name;
            langMatch = true;
            break;
          }
        }
        if (!langMatch) {
          // fallback to en
          resultObject[resKey] = resValue[0].name;
        }
      } else {
        extractLang(resValue, lang);
      }
    }
  }
}
