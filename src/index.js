import { ParseExpression } from "./expression/index.js";
import { getModelInfo } from "./model/index.js";
import { getModeInfo } from "./mode/index.js";
import { ParseDistribution, ParseEquation, ParseMatrixList, ParseVectorList } from "./variable/C.js";
import { ParseSpreadsheet, ParseStatistic } from "./variable/T.js";
import { ParseTableRange } from "./variable/P.js";
import { ParseVariableList } from "./variable/V.js";
import { ParseEquationResult, ParseInequalityResult, ParseNumberResult, ParseStatisticResult } from "./variable/R.js";

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
    }
  }

  setUrl(url) {
    this.url = new URL(url.trim());
    const { search, pathname } = this.url;
    const modelType = pathname.slice(0, 5) === '/ncal' ? 'EY' : 'CY';
    const kv = search.slice(3).split('+').reduce((acc, cur) => {
      const [k, v] = cur.split('-');
      acc[k] = v;
      return acc;
    }, {});
    this.setModelType(modelType)
    this.setKV(kv)
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

  getResult() {
    const { modelType, kv } = this;
    let modelId, modelName, qr, modelVersion;
    if (kv.I) {
      modelId = kv.I.slice(0, 3);
      [modelName, qr] = getModelInfo(modelId, modelType);
      modelVersion = kv.I.slice(3, 4);
    }

    const serialNumber = kv.U;

    let mode;
    if (kv.M) {
      mode = getModeInfo(kv.M);
    }

    let expression;
    if (kv.E) {
      const parseE = new ParseExpression(kv.E, modelType, modelId);
      // TODO: base on setting
      if (1) {
        expression = parseE.parseMath();
      } else {
        expression = parseE.parseLine();
      }
    }
    if (kv.G) {
      // TODO: base on mode
      const parseG = new ParseExpression(kv.G, modelType, modelId);
      let expr2;
      if (1) {
        expr2 = parseG.parseMath();
      } else {
        expr2 = parseG.parseLine();
      }
      expression = [`f(x)=${expression}`, `g(x)=${expr2}`]
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
          result = ParseEquationResult(R, kv.M, kv.S);
          break;
        case 'IN':
          result = ParseInequalityResult(R);
          break;
        default:
          const mainMode = kv.M.slice(0, 2);
          if (mainMode === '03' && kv.M.slice(4, 5) === 'F') {
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
        const mainMode = kv.M.slice(0, 2);
        if (['45', '4A', '4B'].includes(mainMode)) {
          equation = ParseEquation(kv.M, kv.C);
        } else if (mainMode === '0C') {
          distribution = ParseDistribution(kv.M, kv.C);
        } else if (mainMode === '4F') {
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

    return {
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
    };
  }

}

export const parseUrl = (url) => {
  const cwqr = new ClassWizQR();
  return cwqr.setUrl(url).getResult();
}
