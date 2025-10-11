import { tt } from "../utils.js";

export class ParseSetup {
  constructor(S) {
    this.S = S;
  }

  isFullSetup() {
    return this.S.length !== 5;
  }

  getNumberFormatMainCode() {
    if (!this.numberFormatMain) {
      this.numberFormatMain = this.S.slice(0, 1);
    }
    return this.numberFormatMain;
  }

  getNumberFormatSubCode() {
    if (!this.numberFormatSub) {
      this.numberFormatSub = this.S.slice(1, 2);
    }
    return this.numberFormatSub;
  }

  getInputCode() {
    if (!this.inputCode) {
      this.inputCode = this.S.slice(4, 5);
    }
    return this.inputCode;
  }

  getOutputCode() {
    if (!this.outputCode) {
      this.outputCode = this.S.slice(10, 11);
    }
    return this.outputCode;
  }


  getDecimalMarkCode() {
    if (!this.decimalMarkCode) {
      this.decimalMarkCode = this.S.slice(2, 3);
    }
    return this.decimalMarkCode;
  }

  getAngleUnitCode() {
    if (!this.angleUnitCode) {
      this.angleUnitCode = this.S.slice(3, 4);
    }
    return this.angleUnitCode;
  }

  getFractionResultCode() {
    if (!this.fractionResultCode) {
      this.fractionResultCode = this.S.slice(5, 6);
    }
    return this.fractionResultCode;
  }

  getComplexResultCode() {
    if (!this.complexResultCode) {
      this.complexResultCode = this.S.slice(6, 7);
    }
    return this.complexResultCode;
  }

  getStatisticsFrequencyCode() {
    if (!this.statisticsFrequencyCode) {
      this.statisticsFrequencyCode = this.S.slice(7, 8);
    }
    return this.statisticsFrequencyCode;
  }

  getRecurringDecimalCode() {
    if (!this.recurringDecimalCode) {
      this.recurringDecimalCode = this.S.slice(8, 9);
    }
    return this.recurringDecimalCode;
  }

  getSimplifyCode() {
    if (!this.simplifyCode) {
      this.simplifyCode = this.S.slice(9, 10);
    }
    return this.simplifyCode;
  }

  getAutoPowerOffCode() {
    if (!this.autoPowerOffCode) {
      this.autoPowerOffCode = this.S.slice(11, 12);
    }
    return this.autoPowerOffCode;
  }

  getTableTypeCode() {
    if (!this.tableTypeCode) {
      this.tableTypeCode = this.S.slice(12, 13);
    }
    return this.tableTypeCode;
  }

  getEngineerSymbolCode() {
    if (!this.engineerSymbolCode) {
      this.engineerSymbolCode = this.S.slice(13, 14);
    }
    return this.engineerSymbolCode;
  }

  getDigitSeparatorCode() {
    if (!this.digitSeparatorCode) {
      this.digitSeparatorCode = this.S.slice(14, 15);
    }
    return this.digitSeparatorCode;
  }

  getMultiLineFontCode() {
    if (!this.multiLineFontCode) {
      this.multiLineFontCode = this.S.slice(15, 16);
    }
    return this.multiLineFontCode;
  }


  getEquationComplexRootCode() {
    if (!this.equationComplexRootCode) {
      this.equationComplexRootCode = this.S.slice(16, 17);
    }
    return this.equationComplexRootCode;
  }

  // this setup is based on model
  getLanguageCode() {
    if (!this.languageCode) {
      if (this.isFullSetup()) {
        this.languageCode = this.S.slice(17, 18);
      } else {
        this.languageCode = this.S.slice(0, 1);
      }
    }
    return this.languageCode;
  }

  getSpreadsheetAutoCalcCode() {
    if (!this.spreadsheetAutoCalcCode) {
      this.spreadsheetAutoCalcCode = this.S.slice(18, 19);
    }
    return this.spreadsheetAutoCalcCode;
  }

  getSpreadsheetShowCellCode() {
    if (!this.spreadsheetShowCellCode) {
      this.spreadsheetShowCellCode = this.S.slice(19, 20);
    }
    return this.spreadsheetShowCellCode;
  }

  getQRCodeVersionCode() {
    if (!this.qrCodeVersionCode) {
      this.qrCodeVersionCode = this.S.slice(20, 21);
    }
    return this.qrCodeVersionCode;
  }

  getAlgorithmBackgroundCode() {
    if (!this.algorithmBackgroundCode) {
      this.algorithmBackgroundCode = this.S.slice(21, 22);
    }
    return this.algorithmBackgroundCode;
  }

  getAlgorithmUnitSettingCode() {
    if (!this.algorithmUnitSettingCode) {
      this.algorithmUnitSettingCode = this.S.slice(22, 23);
    }
    return this.algorithmUnitSettingCode;
  }

  /**
   * @param {CY|EY|FY} modelType
   */
  parseAll(modelType) {
    const parseNumberFormat = () => {
      const type = 'NUMBER_FORMAT';
      const main = this.getNumberFormatMainCode();
      const sub = this.getNumberFormatSubCode();
      const name = tt(`setup.${type}.name`);
      let value = tt(`setup.${type}.${main}`);
      if (['8', '9'].includes(main)) {
        value += sub;
      }
      return { name, value, type, code: `${main}${sub}` };
    }

    const parseInputOutput = () => {
      const type = 'INPUT_OUTPUT';
      const code = `${this.getInputCode()}${this.getOutputCode()}`;
      const name = tt(`setup.${type}.name`);
      const value = tt(`setup.${type}.${code}`);
      return { name, value, type, code };
    }

    const parseCommon = (type, code) => {
      const name = tt(`setup.${type}.name`);
      const value = tt(`setup.${type}.${code}`) || tt(`setup.${type}.${code}-${modelType}`) || code;
      return { name, value, type, code };
    }

    const setupMap = {
      "DECIMAL_MARK": this.getDecimalMarkCode(),
      "ANGLE_UNIT": this.getAngleUnitCode(),
      "FRACTION_RESULT": this.getFractionResultCode(),
      "COMPLEX_RESULT": this.getComplexResultCode(),
      "STATISTICS_FREQUENCY": this.getStatisticsFrequencyCode(),
      "RECURRING_DECIMAL": this.getRecurringDecimalCode(),
      "SIMPLIFY": this.getSimplifyCode(),
      "AUTO_POWER_OFF": this.getAutoPowerOffCode(),
      "TABLE_TYPE": this.getTableTypeCode(),
      "ENGINEER_SYMBOL": this.getEngineerSymbolCode(),
      "DIGIT_SEPARATOR": this.getDigitSeparatorCode(),
      "MULTI_LINE_FONT": this.getMultiLineFontCode(),
      "EQUATION_COMPLEX_ROOT": this.getEquationComplexRootCode(),
      "LANGUAGE": this.getLanguageCode(),
      "SPREADSHEET_AUTO_CALC": this.getSpreadsheetAutoCalcCode(),
      "SPREADSHEET_SHOW_CELL": this.getSpreadsheetShowCellCode(),
      "QR_CODE_VERSION": this.getQRCodeVersionCode(),
      "ALGORITHM_BACKGROUND": this.getAlgorithmBackgroundCode(),
      "ALGORITHM_UNIT_SETTING": this.getAlgorithmUnitSettingCode(),
    }

    const result = [];
    if (this.isFullSetup()) {
      result.push(parseNumberFormat());
      result.push(parseInputOutput());
      for (const [code, setup] of Object.entries(setupMap)) {
        result.push(parseCommon(code, setup));
      }
    } else {
      // in menu/error, only language is exported
      result.push(parseCommon('LANGUAGE', this.getLanguageCode()));
    }
    return result;
  }
}
