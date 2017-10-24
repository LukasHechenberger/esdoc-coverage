'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xml2js = require('xml2js');

var _Reporter = require('./Reporter');

var _Reporter2 = _interopRequireDefault(_Reporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A reporter that creates JUnit-style XML reports.
 */
class JUnitReporter extends _Reporter2.default {

  /**
   * Creates a new JUnitReporter.
   */
  constructor() {
    super();

    /**
     * The results received.
     * @type {Object[]}
     */
    this.results = [];
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
    super.report(filename, success, actual, expected);

    const testcase = { $: { classname: filename, name: 'should be documented' } };

    if (!success) {
      testcase.failure = [{
        $: { message: 'Missing API documentation' },
        _: `Lines not documented: ${uncoveredLines.join(', ')}`
      }];
    }

    this.results.push(testcase);
  }

  /**
   * Creates and prints the XML reports.
   * @return {Promise<Error, String>} Resolved with the report or an error.
   */
  finish() {
    const report = {
      testsuites: {
        testsuite: [{
          $: {
            name: 'esdoc-coverage',
            tests: this.numberOfFiles,
            errors: 0,
            failures: this.notCoveredFiles,
            time: 0,
            timestamp: new Date().toISOString()
          },
          testcase: this.results
        }]
      }
    };

    return Promise.resolve(new _xml2js.Builder().buildObject(report));
  }

}
exports.default = JUnitReporter;