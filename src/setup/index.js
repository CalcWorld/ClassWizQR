import { tt } from "../utils.js";

export class ParseSetup {
  constructor(S) {
    this.S = S;
  }

  isFullSetup() {
    return this.S.length !== 5;
  }

  getNumberFormatMain() {
    if (!this.numberFormatMain) {
      this.numberFormatMain = this.S.slice(0, 1);
    }
    return this.numberFormatMain;
  }

  getNumberFormatSub() {
    if (!this.numberFormatSub) {
      this.numberFormatSub = this.S.slice(1, 2);
    }
    return this.numberFormatSub;
  }

  getInput() {
    if (!this.input) {
      this.input = this.S.slice(4, 5);
    }
    return this.input;
  }

  getOutput() {
    if (!this.output) {
      this.output = this.S.slice(10, 11);
    }
    return this.output;
  }


  getDecimalMark() {
    if (!this.decimalMark) {
      this.decimalMark = this.S.slice(2, 3);
    }
    return this.decimalMark;
  }

  getAngleUnit() {
    if (!this.angleUnit) {
      this.angleUnit = this.S.slice(3, 4);
    }
    return this.angleUnit;
  }

  getFractionResult() {
    if (!this.fractionResult) {
      this.fractionResult = this.S.slice(5, 6);
    }
    return this.fractionResult;
  }

  getComplexResult() {
    if (!this.complexResult) {
      this.complexResult = this.S.slice(6, 7);
    }
    return this.complexResult;
  }

  getStatisticsFrequency() {
    if (!this.statisticsFrequency) {
      this.statisticsFrequency = this.S.slice(7, 8);
    }
    return this.statisticsFrequency;
  }

  getRecurringDecimal() {
    if (!this.recurringDecimal) {
      this.recurringDecimal = this.S.slice(8, 9);
    }
    return this.recurringDecimal;
  }

  getSimplify() {
    if (!this.simplify) {
      this.simplify = this.S.slice(9, 10);
    }
    return this.simplify;
  }

  getAutoPowerOff() {
    if (!this.autoPowerOff) {
      this.autoPowerOff = this.S.slice(11, 12);
    }
    return this.autoPowerOff;
  }

  getTableType() {
    if (!this.tableType) {
      this.tableType = this.S.slice(12, 13);
    }
    return this.tableType;
  }

  getEngineerSymbol() {
    if (!this.engineerSymbol) {
      this.engineerSymbol = this.S.slice(13, 14);
    }
    return this.engineerSymbol;
  }

  getDigitSeparator() {
    if (!this.digitSeparator) {
      this.digitSeparator = this.S.slice(14, 15);
    }
    return this.digitSeparator;
  }

  getMultiLineFont() {
    if (!this.multiLineFont) {
      this.multiLineFont = this.S.slice(15, 16);
    }
    return this.multiLineFont;
  }


  getEquationComplexRoot() {
    if (!this.equationComplexRoot) {
      this.equationComplexRoot = this.S.slice(16, 17);
    }
    return this.equationComplexRoot;
  }

  // this setup is based on model
  getLanguage() {
    if (!this.language) {
      if (this.isFullSetup()) {
        this.language = this.S.slice(17, 18);
      } else {
        this.language = this.S.slice(0, 1);
      }
    }
    return this.language;
  }

  getSpreadsheetAutoCalc() {
    if (!this.spreadsheetAutoCalc) {
      this.spreadsheetAutoCalc = this.S.slice(18, 19);
    }
    return this.spreadsheetAutoCalc;
  }

  getSpreadsheetShowCell() {
    if (!this.spreadsheetShowCell) {
      this.spreadsheetShowCell = this.S.slice(19, 20);
    }
    return this.spreadsheetShowCell;
  }

  getQRCodeVersion() {
    if (!this.qrCodeVersion) {
      this.qrCodeVersion = this.S.slice(20, 21);
    }
    return this.qrCodeVersion;
  }

  getAlgorithmBackground() {
    if (!this.algorithmBackground) {
      this.algorithmBackground = this.S.slice(21, 22);
    }
    return this.algorithmBackground;
  }

  getAlgorithmUnitSetting() {
    if (!this.algorithmUnitSetting) {
      this.algorithmUnitSetting = this.S.slice(22, 23);
    }
    return this.algorithmUnitSetting;
  }

  /**
   * @param {CY|EY|FY} modelType
   */
  parseAll(modelType) {
    const parseNumberFormat = () => {
      const type = 'NUMBER_FORMAT';
      const main = this.getNumberFormatMain();
      const sub = this.getNumberFormatSub();
      const name = tt(`setup.${type}.name`);
      let value = tt(`setup.${type}.${main}`);
      if (['8', '9'].includes(main)) {
        value += sub;
      }
      return { name, value, type, code: `${main}${sub}` };
    }

    const parseInputOutput = () => {
      const type = 'INPUT_OUTPUT';
      const code = `${this.getInput()}${this.getOutput()}`;
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
      "DECIMAL_MARK": this.getDecimalMark(),
      "ANGLE_UNIT": this.getAngleUnit(),
      "FRACTION_RESULT": this.getFractionResult(),
      "COMPLEX_RESULT": this.getComplexResult(),
      "STATISTICS_FREQUENCY": this.getStatisticsFrequency(),
      "RECURRING_DECIMAL": this.getRecurringDecimal(),
      "SIMPLIFY": this.getSimplify(),
      "AUTO_POWER_OFF": this.getAutoPowerOff(),
      "TABLE_TYPE": this.getTableType(),
      "ENGINEER_SYMBOL": this.getEngineerSymbol(),
      "DIGIT_SEPARATOR": this.getDigitSeparator(),
      "MULTI_LINE_FONT": this.getMultiLineFont(),
      "EQUATION_COMPLEX_ROOT": this.getEquationComplexRoot(),
      "LANGUAGE": this.getLanguage(),
      "SPREADSHEET_AUTO_CALC": this.getSpreadsheetAutoCalc(),
      "SPREADSHEET_SHOW_CELL": this.getSpreadsheetShowCell(),
      "QR_CODE_VERSION": this.getQRCodeVersion(),
      "ALGORITHM_BACKGROUND": this.getAlgorithmBackground(),
      "ALGORITHM_UNIT_SETTING": this.getAlgorithmUnitSetting(),
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
      result.push(parseCommon('LANGUAGE', this.getLanguage()));
    }
    return result;
  }
}
