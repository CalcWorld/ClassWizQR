import { ParseExpression } from "./expression/index.js";
import { getModelInfo } from "./model/index.js";
import {
  ParseAns,
  ParseMatrixList,
  ParseSpreadsheet,
  ParseStatistic,
  ParseTableRange,
  ParseVariableList
} from "./variable/index.js";
import { getModeInfo } from "./mode/index.js";

export class ClassWizQR {
  constructor() {
    this.url = undefined;
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

    this.modelType = undefined;
    this.modelId = undefined;
    this.modelName = undefined;
    this.modelVersion = undefined;
    this.qr = undefined;

    this.serialNumber = undefined;

    this.expression = undefined;
  }

  setUrl(url) {
    this.url = new URL(url);
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
    if (kv.R || kv.Q) {
      const ans = kv.R || kv.Q;
      result = ParseAns(ans);
    }

    let variable;
    if (kv.V) {
      variable = ParseVariableList(kv.V, modelType);
    }

    let matrix;
    if (kv.C) {
      matrix = ParseMatrixList(kv.C);
    }

    let spreadsheet, statistic
    if (kv.T) {
      if (kv.T.startsWith('SP')) {
        spreadsheet = ParseSpreadsheet(kv.T);
      } else {
        statistic = ParseStatistic(kv.T);
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
      tableRange,
      result,
      variable,
      matrix,
      spreadsheet,
      statistic,
    };
  }

}

export const parseUrl = (url) => {
  const cwqr = new ClassWizQR();
  return cwqr.setUrl(url).getResult();
}
