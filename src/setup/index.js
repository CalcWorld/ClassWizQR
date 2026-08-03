import { tt } from "../utils.js";
import { getModelProfile } from '../model/index.js';
import { calcChecksumFromKV } from './sum.js';

export class ParseSetup {
  constructor(kv) {
    const { S } = kv;
    this.S = S;
    this.kv = kv;
  }

  isFullSetup() {
    return this.S.length !== 5;
  }

  getNumberFormatMain() {
    return this.S.slice(0, 1);
  }

  getNumberFormatSub() {
    return this.S.slice(1, 2);
  }

  getInput() {
    return this.S.slice(4, 5);
  }

  getOutput() {
    return this.S.slice(10, 11);
  }


  getDecimalMark() {
    return this.S.slice(2, 3);
  }

  getAngleUnit() {
    return this.S.slice(3, 4);
  }

  getFractionResult() {
    return this.S.slice(5, 6);
  }

  getComplexResult() {
    return this.S.slice(6, 7);
  }

  getStatisticsFrequency() {
    return this.S.slice(7, 8);
  }

  getRecurringDecimal() {
    return this.S.slice(8, 9);
  }

  getSimplify() {
    return this.S.slice(9, 10);
  }

  getAutoPowerOff() {
    return this.S.slice(11, 12);
  }

  getTableType() {
    return this.S.slice(12, 13);
  }

  getEngineerSymbol() {
    return this.S.slice(13, 14);
  }

  getDigitSeparator() {
    return this.S.slice(14, 15);
  }

  getMultiLineFont() {
    return this.S.slice(15, 16);
  }


  getEquationComplexRoot() {
    return this.S.slice(16, 17);
  }

  // this setup is based on model
  getLanguage() {
    if (this.isFullSetup()) {
      return this.S.slice(17, 18);
    } else {
      return this.S.slice(0, 1);
    }
  }

  getSpreadsheetAutoCalc() {
    return this.S.slice(18, 19);
  }

  getSpreadsheetShowCell() {
    return this.S.slice(19, 20);
  }

  getQRCodeVersion() {
    return this.S.slice(20, 21);
  }

  getAlgorithmBackground() {
    return this.S.slice(21, 22);
  }

  getAlgorithmUnitSetting() {
    return this.S.slice(22, 23);
  }

  getPreserveSetting() {
    return this.S.slice(23, 24);
  }

  getUrlChecksum() {
    return this.S.slice(-4);
  }

  /**
   * @param {'CY'|'EY'|'FY'} modelType
   * @param {string} modelId
   */
  parseAll({ modelType, modelId }) {
    const parseNumberFormat = (type) => {
      const main = this.getNumberFormatMain();
      const sub = this.getNumberFormatSub();
      const name = tt(`setup.${type}.name`);
      let value = tt(`setup.${type}.${main}`);
      if (['8', '9'].includes(main)) {
        value += sub;
      }
      return { name, value, type, code: `${main}${sub}` };
    }

    const parseInputOutput = (type) => {
      const code = `${this.getInput()}${this.getOutput()}`;
      const name = tt(`setup.${type}.name`);
      const value = tt(`setup.${type}.${code}`);
      return { name, value, type, code };
    }

    const parseLanguage = (type, code) => {
      const name = tt(`setup.${type}.name`);
      let value = code;
      const languageType = getModelProfile(modelType, modelId).language ?? 'en';
      const langCode = tt(`setup.${type}.${languageType}.${code}`);
      if (langCode) {
        const localLang = tt(`setup.${type}_LOCAL.${langCode}`);
        const transLang = tt(`setup.${type}_TRANS.${langCode}`);
        if (transLang && localLang) {
          if (localLang === transLang) {
            value = localLang;
          } else {
            value = `${localLang} (${transLang})`;
          }
        }
      }
      return { name, value, type, code };
    };

    const parseUrlChecksum = (type, code) => {
      const name = tt(`setup.${type}.name`);
      const calcChecksum = calcChecksumFromKV(this.kv);
      const value = `${calcChecksum} ${calcChecksum === code ? 'OK' : 'NG'}`;
      return { name, value, type, code };
    };

    const parseCommon = (type, code) => {
      const name = tt(`setup.${type}.name`);
      const value = tt(`setup.${type}.${code}`) || tt(`setup.${type}.${code}-${modelType}`) || code;
      return { name, value, type, code };
    }

    const result = [];
    result.push(parseLanguage('LANGUAGE', this.getLanguage()))
    if (this.isFullSetup()) {
      const setupMap = {
        DECIMAL_MARK: this.getDecimalMark(),
        ANGLE_UNIT: this.getAngleUnit(),
        FRACTION_RESULT: this.getFractionResult(),
        COMPLEX_RESULT: this.getComplexResult(),
        STATISTICS_FREQUENCY: this.getStatisticsFrequency(),
        RECURRING_DECIMAL: this.getRecurringDecimal(),
        SIMPLIFY: this.getSimplify(),
        AUTO_POWER_OFF: this.getAutoPowerOff(),
        TABLE_TYPE: this.getTableType(),
        ENGINEER_SYMBOL: this.getEngineerSymbol(),
        DIGIT_SEPARATOR: this.getDigitSeparator(),
        MULTI_LINE_FONT: this.getMultiLineFont(),
        EQUATION_COMPLEX_ROOT: this.getEquationComplexRoot(),
        SPREADSHEET_AUTO_CALC: this.getSpreadsheetAutoCalc(),
        SPREADSHEET_SHOW_CELL: this.getSpreadsheetShowCell(),
        QR_CODE_VERSION: this.getQRCodeVersion(),
        ALGORITHM_BACKGROUND: this.getAlgorithmBackground(),
        ALGORITHM_UNIT_SETTING: this.getAlgorithmUnitSetting(),
        PRESERVE_SETTING: this.getPreserveSetting(),
      }

      result.push(parseNumberFormat('NUMBER_FORMAT'));
      result.push(parseInputOutput('INPUT_OUTPUT'));
      for (const [type, code] of Object.entries(setupMap)) {
        result.push(parseCommon(type, code));
      }
    }
    result.push(parseUrlChecksum('URL_CHECKSUM', this.getUrlChecksum()))

    return result;
  }
}
