'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _Reporter = require('./Reporter');

var _Reporter2 = _interopRequireDefault(_Reporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A reporter that prints an ASCII table with all files and their coverage values.
 */
class CliReporter extends _Reporter2.default {

  /**
   * Creates a new CliReporter.
   */
  constructor() {
    super();

    /**
     * The table to print.
     * @type {cli-table~Table}
     */
    this.table = new _cliTable2.default({
      head: ['', _chalk2.default.cyan('Coverage'), 'Uncovered lines']
    });
  }

  /**
   * Adds a row to the table
   * @param {string} name Name of the row.
   * @param {boolean} success If the file's documentation coverage meets the threshold.
   * @param {number} actual Number of documented identifiers.
   * @param {number} expected Number of expected identifiers.
   * @param {number[]} uncoveredLines Array of line numbers not documented.
   */
  addRow(name, success, actual, expected, uncoveredLines) {
    this.table.push({
      [_chalk2.default.white(name)]: [[_chalk2.default[success ? 'green' : 'red'](`${(actual / expected * 100).toFixed(1)}%`), _chalk2.default.gray(`(${actual}/${expected})`)].join(' '), `${uncoveredLines.join(', ')}`]
    });
  }

  /**
   * Reports the coverage of a file.
   * @param {string} filename Name of the file.
   * @param {boolean} success If the file's documentation coverage meets the threshold.
   * @param {number} actual Number of documented identifiers.
   * @param {number} expected Number of expected identifiers.
   * @param {number[]} uncoveredLines Array of line numbers not documented.
   */
  report(filename, success, actual, expected, uncoveredLines) {
    super.report(filename, success, actual, expected, uncoveredLines);

    this.addRow(filename, success, actual, expected, uncoveredLines);
  }

  /**
   * Adds a summary row to the table and prints it. Also sets the process exit code to `1` if the
   * threshold was not met.
   * @return {Promise<Error, String>} Resolved with the report or an error.
   */
  finish() {
    this.addRow(_chalk2.default.cyan('All files'), this.success, this.actual, this.expected, []);

    process.exitCode = this.success ? 0 : 1;

    return Promise.resolve(this.table.toString());
  }

}
exports.default = CliReporter;