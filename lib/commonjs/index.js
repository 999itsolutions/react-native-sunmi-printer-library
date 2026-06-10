"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTextStyle = exports.setParagraphStyle = exports.setFontSize = exports.setDefaultFontSize = exports.setAlignment = exports.sendRAWData = exports.scan = exports.resetPrinterStyle = exports.printTextWithFont = exports.printText = exports.printSelfChecking = exports.printQRCode = exports.printOriginalText = exports.printImage = exports.printHR = exports.printColumnsText = exports.printColumnsString = exports.printBarcode = exports.print2DCodePDF417 = exports.print2DCodeDataMatrix = exports.prepare = exports.lineWrap = exports.labelOutput = exports.labelLocate = exports.hr = exports.getPrinterState = exports.getPrinterInfo = exports.getPrintedLength = exports.getCutPaperTimes = exports.exitPrinterBuffer = exports.enterPrinterBuffer = exports.defaultFontSize = exports.cutPaper = exports.commitPrinterBuffer = exports.MaxPixelWidth = exports.EventType = void 0;
var _reactNative = require("react-native");
/**
 * see: SUNMI Developers <https://developer.sunmi.com/en-US/>
 */

/**
 * Native Method for Printer
 */

/**
 * Native Method for Scanner
 */

const sunmiPrinterLibrary = _reactNative.NativeModules.SunmiPrinterLibrary;
const sunmiScannerLibrary = _reactNative.NativeModules.SunmiScannerLibrary;
const OS_DOES_NOT_SUPPORT = 'Your OS does not support';
const MaxPixelWidth = exports.MaxPixelWidth = {
  '58mm': 384,
  '80mm': 576
};
const defaultFontSize = exports.defaultFontSize = 24;
const EventType = exports.EventType = {
  onScanSuccess: 'onScanSuccess',
  onScanFailed: 'onScanFailed'
};
/**
 * connect printer
 *
 * @example
 * await SunmiPrinterLibrary.connect()
 */
const connect = _reactNative.Platform.select({
  android: () => sunmiPrinterLibrary.connect(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * initialize printer
 *
 * @note
 * It calls printerInit after connects printer
 *
 * @example
 * await SunmiPrinterLibrary.printerInit()
 */
const printerInit = _reactNative.Platform.select({
  android: () => sunmiPrinterLibrary.printerInit(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * prepare
 *
 * @note
 * It must call to connect and initialize printer. If re-call it, reset text stylings.
 *
 * @example
 * await SunmiPrinterLibrary.prepare()
 */
const prepare = async () => {
  try {
    await connect();
    await printerInit();
    await setDefaultFontSize();
    return true;
  } catch (error) {
    return Promise.reject('prepare() is failed.' + error.message);
  }
};

/**
 * reset printer style
 *
 * @example
 * await SunmiPrinterLibrary.resetPrinterStyle()
 */
exports.prepare = prepare;
const resetPrinterStyle = async () => {
  try {
    await printerInit();
    await setDefaultFontSize();
    return true;
  } catch (error) {
    return Promise.reject('resetPrinterStyle() is failed.' + error.message);
  }
};

// !!! This is temporarily comment-out because it is not available. !!!
// FIXME: It can not use disconnect().
// error message > Service not registered: com.sunmiprinterlibrary.SunmiPrinterLibraryModule$disconnect$callback$1@bb8f7ce
//
// /**
//  * disconnect printer
//  *
//  * @note
//  * It cannot disconnect. why...?
//  * "Service not registered: com.sunmiprinterlibrary.SunmiPrinterLibraryModule$disconnect$callback$1@4a31ba4"
//  *
//  * @example
//  * await SunmiPrinterLibrary.disconnect()
//  */
// export const disconnect  = Platform.select<() => Promise<void>>({
//   android: () => sunmiPrinterLibrary.disconnect(),
//   default: () => Promise.reject(OS_DOES_NOT_SUPPORT),
// })

/**
 * Print self-inspection
 */
exports.resetPrinterStyle = resetPrinterStyle;
const printSelfChecking = exports.printSelfChecking = _reactNative.Platform.select({
  android: () => sunmiPrinterLibrary.printerSelfChecking(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

// /**
//  * Get the SN of a printer board
//  */
// export const getPrinterSerialNo = Platform.select<() => Promise<string>>({
//   android: () => sunmiPrinterLibrary.getPrinterSerialNo(),
//   default: () => Promise.reject(OS_DOES_NOT_SUPPORT),
// })

// /**
//  * Get printer firmware version
//  */
// export const getPrinterVersion = Platform.select<() => Promise<string>>({
//   android: () => sunmiPrinterLibrary.getPrinterVersion(),
//   default: () => Promise.reject(OS_DOES_NOT_SUPPORT),
// })

// /**
//  * Get the version number of a print service
//  */
// export const getServiceVersion = Platform.select<() => Promise<string>>({
//   android: () => sunmiPrinterLibrary.getServiceVersion(),
//   default: () => Promise.reject(OS_DOES_NOT_SUPPORT),
// })

// /**
//  * Get printer type interface
//  */
// export const getPrinterModal = Platform.select<() => Promise<string>>({
//   android: () => sunmiPrinterLibrary.getPrinterModal(),
//   default: () => Promise.reject(OS_DOES_NOT_SUPPORT),
// })

/**
 * Get the current paper spec of a printer
 *
 * @returns "58mm" | "80mm"
 */
const getPaperWidth = _reactNative.Platform.select({
  android: async () => {
    try {
      const result = await sunmiPrinterLibrary.getPrinterPaper();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject('getPaperWidth() is failed.' + error.message);
    }
  },
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Get the print length of a printhead
 */
const getPrintedLength = exports.getPrintedLength = _reactNative.Platform.select({
  android: () => sunmiPrinterLibrary.getPrintedLength(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});
const PrinterState = {
  1: 'The printer works normally',
  2: 'Preparing printer',
  3: 'Abnormal communication',
  4: 'Out of paper',
  5: 'Overheated',
  6: 'Open the lid',
  7: 'The paper cutter is abnormal',
  8: 'The paper cutter has been recovered',
  9: 'No black mark has been detected',
  505: 'No printer has been detected',
  507: 'Failed to upgrade the printer firmware'
};
/**
 * Get the latest status of a printer
 */
const getPrinterState = exports.getPrinterState = _reactNative.Platform.select({
  android: async () => {
    try {
      const value = await sunmiPrinterLibrary.updatePrinterState();
      const description = PrinterState[value];
      return Promise.resolve({
        value,
        description
      });
    } catch (error) {
      return Promise.reject('getPrinterState() is failed.' + error.message);
    }
  },
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Set printer style
 * @param {TextStyle} key - "doubleWidth" | "doubleHeight" | "bold" | "underline" | "antiWhite" | "strikethrough" | "italic" | "invert"
 * @param {boolean} value true | false
 */
const setTextStyle = exports.setTextStyle = _reactNative.Platform.select({
  android: (style, value) => sunmiPrinterLibrary.setTextStyle(style, value),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Set printer style
 * @param {ParagraphStyle} key - "textRightSpacing" | "relativePosition" | "absolutePosition" | "lineSpacing" | "leftSpacing" | "strikethroughStyle"
 * @param {number} value integer
 */
const setParagraphStyle = exports.setParagraphStyle = _reactNative.Platform.select({
  android: (style, value) => sunmiPrinterLibrary.setParagraphStyle(style, value),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Set alignment
 *
 * @param {Alignment} alignment "left" | "center" | "right"
 */
const setAlignment = exports.setAlignment = _reactNative.Platform.select({
  android: alignment => sunmiPrinterLibrary.setAlignment(alignment),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

// !!! This is temporarily comment-out because it is not available. !!!
//
// /**
//  * Set print typeface (unavailable for now)
//  *
//  * @note
//  * unavailable for now
//  *
//  * @param {FontName} fontName "chineseMonospaced"
//  */
// export const setFontName = Platform.select<(fontName: FontName) => Promise<void>>({
//   android: (fontName) => sunmiPrinterLibrary.setFontName(fontName),
//   default: () => Promise.reject(OS_DOES_NOT_SUPPORT),
// })

/**
 * Set font size
 *
 * @param {number} fontSize
 */
const setFontSize = exports.setFontSize = _reactNative.Platform.select({
  android: fontSize => sunmiPrinterLibrary.setFontSize(fontSize),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Set default font size
 */
const setDefaultFontSize = () => sunmiPrinterLibrary.setFontSize(defaultFontSize);

// !!! This is temporarily comment-out. !!!
//
// /**
//  * Set bold
//  *
//  * @note
//  * It is better to use setPrinterStyle.
//  *
//  * @param {boolean} isBold
//  */
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const setBold = Platform.select<(isBold: boolean) => Promise<void>>({
//   android: (isBold) => sunmiPrinterLibrary.setBold(isBold),
//   default: () => Promise.reject(OS_DOES_NOT_SUPPORT),
// })

/**
 * Print text
 *
 * @param {string} text
 */
exports.setDefaultFontSize = setDefaultFontSize;
const printText = exports.printText = _reactNative.Platform.select({
  android: text => sunmiPrinterLibrary.printText(text),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Print text in a specified typeface and size
 *
 * @param {string} text
 * @param {Typeface} typeface "default" only (unavailable for now)
 * @param {number} fontSize
 */
const printTextWithFont = exports.printTextWithFont = _reactNative.Platform.select({
  android: (text, typeface, fontSize) => sunmiPrinterLibrary.printTextWithFont(text, typeface, fontSize),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Print Vector Font
 *
 * @note
 * output characters are in the same width of vector fonts, which means that they are not monospace.
 *
 * @example
 * printOriginalText('κρχκμνκλρκνκνμρτυφ')
 */
const printOriginalText = exports.printOriginalText = _reactNative.Platform.select({
  android: text => sunmiPrinterLibrary.printOriginalText(text),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Print a row of a table
 *
 * @note
 * - This may not supports width and alignment for each column. Its width means text length.
 * - This does not support Arabic Characters. If you print it, use printColumnsString.
 *
 * @example
 * SunmiPrinterLibrary.printColumnsText(
 *      ['apple', 'orange', 'banana'],
 *      [8, 8, 8],
 *      ['center', 'center', 'center'])
 */
const printColumnsText = exports.printColumnsText = _reactNative.Platform.select({
  android: (texts, widths, alignments) => sunmiPrinterLibrary.printColumnsText(texts, widths, alignments),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Print a row of a table
 *
 * @note
 * This supports width and alignment for each column.
 *
 * @example
 * SunmiPrinterLibrary.printColumnsString(
 *      ['apple', 'orange', 'banana'],
 *      [8, 8, 8],
 *      ['center', 'center', 'center'])
 */
const printColumnsString = exports.printColumnsString = _reactNative.Platform.select({
  android: (texts, widths, alignments) => sunmiPrinterLibrary.printColumnsString(texts, widths, alignments),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Print 1D BarCode
 *
 * @note
 * Text pattern (e.g. length, character) is determined by symbology.
 *
 * @description
 * - code39
 *    - Numbers within 13 digits can be printed
 * - code93
 *    - Numbers within 17 digits can be printed
 * - JAN8(EAN8)
 *    - 8-digit numbers (the last digit is for parity check). The effective length is 8 digits (numbers).
 * - JAN13(EAN13)
 *    - The effective length is 13 digits, and the last digit is for parity check.
 * - ITF
 *    - Number (even number of digits) within 14 digits is required.
 * - Codabar
 *    - Numbers within 0-9 plus 6 special characters. Maximum18 digitscan be printed. UPC-E 8-digit number (the last digit is for parity check)
 * - UPC-A
 *    - 12-digit number (the last digit is for parity check)
 * - code128
 *    - Code128 can be divided into subset A, B and C:
 *    - 128A: numbers, upper-case letters, and control characters, etc.
 *    - 128B: numbers, upper- and lower-case letters and special character.
 *    - 128C: numbers only. It must have an even number of digits (if it has an odd number of digits, the last digit will be omitted).
 *    - By default, the interface uses subset B. “{A” or “{C” should be added before the content if you need to use subset A or C, for example: “{A2344A”, ”{C123123”, ”{A1A{B13B{C12”.
 *
 * @example
 * SunmiPrinterLibrary.printBarcode('1234567890', 'CODE128', 162, 2, 'textUnderBarcode')
 *
 */
const printBarcode = exports.printBarcode = _reactNative.Platform.select({
  android: (text, symbology, height, width, textPosition) => sunmiPrinterLibrary.printBarcode(text, symbology, height, width, textPosition),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Print QR code
 *
 * @param {string} text - QR code to be printed.
 * @param {number} moduleSize - It is a size of a QR code block and should be within 4-16.
 * @param {QRErrorLevel} errorLevel - QR code error correction level
 *
 * @description
 * - After calling this method, the content will be printed under normal print status, and every QR code block is 4 Pixel (when smaller than 4 Pixel, the code parsing might fail).
 * - version19 (93*93) is a maximum mode supported.
 *
 * @example
 * SunmiPrinterLibrary.printQRCode('Hello World', 8, 'middle')
 */
const printQRCode = exports.printQRCode = _reactNative.Platform.select({
  android: async (text, moduleSize, errorLevel) => {
    try {
      if (moduleSize < 4 || 16 < moduleSize) {
        return Promise.reject('printQrCode is failed. moduleSize should be within 4 - 16.');
      }
      await sunmiPrinterLibrary.printQRCode(text, moduleSize, errorLevel);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(`printQRCode is failed. ${error.message}`);
    }
  },
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Print 2D code (PDF417)
 *
 * @param {string} text - 2D barcode to be printed.
 * @param {number} moduleSize - It is a size of a QR code block and should be within 1 - 4.
 * @param {number} errorLevel - It is error correction level and should be within 0 - 3
 *
 * @example
 * SunmiPrinterLibrary.print2DCodePDF417('Hello World', 4, 2)
 */
const print2DCodePDF417 = exports.print2DCodePDF417 = _reactNative.Platform.select({
  android: async (text, moduleSize, errorLevel) => {
    try {
      const symbology = 2;
      if (moduleSize < 1 || 4 < moduleSize) {
        return Promise.reject('print2DCodePDF417 is failed. If PDF417, moduleSize should be within 1-4.');
      }
      if (errorLevel < 0 || 3 < errorLevel) {
        return Promise.reject('print2DCodePDF417 is failed. If PDF417, errorLevel should be within 0-3.');
      }
      await sunmiPrinterLibrary.print2DCode(text, symbology, moduleSize, errorLevel);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('print2DCodePDF417() is failed.' + error.message);
    }
  },
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Print 2D code (DataMatrix)
 *
 * @param {string} text - 2D barcode to be printed.
 * @param {number} moduleSize - It is a size of a QR code block and should be within 4 - 16.
 * @param {number} errorLevel - It is error correction level and should be within 0 - 3
 *
 * @example
 * SunmiPrinterLibrary.print2DCodeDataMatrix('Hello World', 12, 2)
 */
const print2DCodeDataMatrix = exports.print2DCodeDataMatrix = _reactNative.Platform.select({
  android: async (text, moduleSize, errorLevel) => {
    try {
      const symbology = 3;
      if (moduleSize < 4 || 16 < moduleSize) {
        return Promise.reject('print2DCode is failed. If DataMatrix, moduleSize should be within 4 - 16.');
      }
      if (errorLevel < 0 || 3 < errorLevel) {
        return Promise.reject('print2DCode is failed. If DataMatrix, errorLevel should be within 0 - 3.');
      }
      await sunmiPrinterLibrary.print2DCode(text, symbology, moduleSize, errorLevel);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('print2DCodeDataMatrix() is failed.' + error.message);
    }
  },
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Implement n LFs on the paper
 */
const lineWrap = exports.lineWrap = _reactNative.Platform.select({
  android: count => sunmiPrinterLibrary.lineWrap(count),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Cut paper
 *
 * @note
 * It is only available to the desktop devices with a cutter.
 */
const cutPaper = exports.cutPaper = _reactNative.Platform.select({
  android: () => sunmiPrinterLibrary.cutPaper(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Get the number of times a cutter has been used
 *
 * @note
 * It is only available to the desktop devices with a cutter.
 */
const getCutPaperTimes = exports.getCutPaperTimes = _reactNative.Platform.select({
  android: () => sunmiPrinterLibrary.getCutPaperTimes(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * print image
 *
 * @description
 * print image that is encoded Base64
 *
 * @param {string} base64 'data:image/png;base64,iVBORw0KGgoAAAA...'
 * @param {number} pixelWidth if paper width is 58mm then max 384 or it is 80mm then max 576.
 * @param {PrintImageType} type 'binary' or 'grayscale'
 *
 * @example
 * SunmiPrinterLibrary.printImage(sampleImageBase64, 384, 'grayscale')
 */
const printImage = exports.printImage = _reactNative.Platform.select({
  android: async (base64, pixelWidth, type) => {
    try {
      const _type = type === 'binary' ? 0 : 2;
      await sunmiPrinterLibrary.printBitmapBase64Custom(base64, pixelWidth, _type);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('printImage is failed.');
    }
  },
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * get text for HorizontalRule
 *
 * @note
 * It NEEDs await.
 *
 * @note
 * This function is an original method.
 * It may not be displayed correctly depending on your environment.
 * It is calculated from the character width.
 *
 * @param {BarType} barType - 'line' | 'double' | 'dots' | 'wave' | 'plus' | 'star'
 *
 * @example
 * const hr = await SunmiPrinterLibrary.hr('plus')
 *
 */
const hr = exports.hr = _reactNative.Platform.select({
  android: async barType => {
    try {
      let separator = '-';
      switch (barType) {
        case 'line':
          separator = '-';
          break;
        case 'double':
          separator = '=';
          break;
        case 'dots':
          separator = '･';
          break;
        case 'wave':
          separator = '~';
          break;
        case 'plus':
          separator = '+';
          break;
        case 'star':
          separator = '*';
          break;
      }
      const lengthPerCharacter = 0.5;
      const paperWidth = await getPaperWidth();
      const pixelWidth = MaxPixelWidth[paperWidth];
      const count = pixelWidth / (lengthPerCharacter * defaultFontSize);
      const text = separator.repeat(count);
      return Promise.resolve(text);
    } catch (error) {
      return Promise.reject('hr is failed.' + error.message);
    }
  },
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * print HorizontalRule by text
 *
 * @note
 * It NEEDs await.
 *
 * @note
 * This function is an original method.
 * It may not be displayed correctly depending on your environment.
 * It is calculated from the character width.
 *
 * @param {BarType} barType - 'line' | 'double' | 'dots' | 'wave' | 'plus' | 'star'
 *
 * @example
 * await SunmiPrinterLibrary.printHR('plus')
 *
 */
const printHR = exports.printHR = _reactNative.Platform.select({
  android: async barType => {
    try {
      const text = await hr(barType);
      await sunmiPrinterLibrary.printTextWithFont(text, 'default', defaultFontSize);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('printHR is failed.' + error.message);
    }
  },
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * scan barcode / QR code
 *
 * @example
 *
 * ```
 * const result = await SunmiPrinterLibrary.scan()
 * ```
 *
 * OR
 *
 * ```
 * const scan = () => {
 *    SunmiPrinterLibrary.scan()
 * }
 *
 * useEffect(() => {
 *    DeviceEventEmitter.addListener(SunmiPrinterLibrary.EventType.onScanSuccess, (message) => {
 *       console.log(message)
 *    })
 *    DeviceEventEmitter.addListener(SunmiPrinterLibrary.EventType.onScanFailed, (message) => {
 *       console.log(message)
 *    })
 *    return () => {
 *       DeviceEventEmitter.removeAllListeners(SunmiPrinterLibrary.EventType.onScanSuccess)
 *       DeviceEventEmitter.removeAllListeners(SunmiPrinterLibrary.EventType.onScanFailed)
 *    }
 * }, [])
 *```
 *
 */
const scan = exports.scan = _reactNative.Platform.select({
  android: () => sunmiScannerLibrary.scan(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * get Printer info.
 *
 * @note
 * It gets printer information, such as serial number, in bulk.
 *
 * @example
 *  const {
 *      serialNumber, printerVersion, serviceVersion, printerModal, paperWidth, pixelWidth
 *    } = await SunmiPrinterLibrary.getPrinterInfo()
 */
const getPrinterInfo = exports.getPrinterInfo = _reactNative.Platform.select({
  android: async () => {
    try {
      const nativeResult = await sunmiPrinterLibrary.getPrinterInfo();
      const paperWidth = nativeResult.paperWidth;
      const result = {
        ...nativeResult,
        paperWidth: paperWidth,
        pixelWidth: MaxPixelWidth[paperWidth]
      };
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject('getPrinterInfo is failed.');
    }
  },
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Send raw data to printer
 *
 * @param {string} base64
 */
const sendRAWData = exports.sendRAWData = _reactNative.Platform.select({
  android: base64 => sunmiPrinterLibrary.sendRAWData(base64),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Enable transaction printing mode
 *
 * @param {boolean} clear - whether to clear the content in the buffer area:
 * if true, clears the last transaction to print uncommitted content.
 * if false, does not clear that the last transaction printed uncommitted content, and the next commit will contain the last.
 */
const enterPrinterBuffer = exports.enterPrinterBuffer = _reactNative.Platform.select({
  android: clear => sunmiPrinterLibrary.enterPrinterBuffer(clear),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Exit transaction mode
 *
 * @param {boolean} commit - Whether commit prints out the buffer content:
 * if true, prints everything in the transaction queue.
 * if false, does not print content in the transaction queue, which is saved until the next commit.
 */
const exitPrinterBuffer = exports.exitPrinterBuffer = _reactNative.Platform.select({
  android: commit => sunmiPrinterLibrary.exitPrinterBuffer(commit),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});

/**
 * Commit transaction printing
 */
const commitPrinterBuffer = exports.commitPrinterBuffer = _reactNative.Platform.select({
  android: () => sunmiPrinterLibrary.commitPrinterBuffer(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});
const labelLocate = exports.labelLocate = _reactNative.Platform.select({
  android: () => sunmiPrinterLibrary.labelLocate(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});
const labelOutput = exports.labelOutput = _reactNative.Platform.select({
  android: () => sunmiPrinterLibrary.labelOutput(),
  default: () => Promise.reject(OS_DOES_NOT_SUPPORT)
});
//# sourceMappingURL=index.js.map