/**
 * Reports per-file documentation coverage.
 * @abstract
 */
export default class Reporter {

  /**
   * Creates a new reporter.
   */
  constructor() {
    /**
     * Number of covered identifiers.
     * @type {number}
     */
    this.actual = 0;

    /**
     * Total number of identifiers.
     * @type {number}
     */
    this.expected = 0;

    /**
     * If the report has a failure.
     * @type {boolean}
     */
    this.success = true;

    /**
     * The number of files processed.
     * @type {number}
     */
    this.numberOfFiles = 0;

    /**
     * The number of files processed but nut covered.
     * @type {number}
     */
    this.notCoveredFiles = 0;
  }

  /**
   * Reports the coverage of a file.
   * @param {string} filename Name of the file.
   * @param {boolean} success If the file's documentation coverage meets the threshold.
   * @param {number} actual Number of documented identifiers.
   * @param {number} expected Number of expected identifiers.
   * @param {number[]} uncoveredLines Array of line numbers not documented.
   */
  // eslint-disable-next-line no-unused-vars
  report(filename, success, actual, expected, uncoveredLines) {
    this.numberOfFiles++;
    this.actual += actual;
    this.expected += expected;

    if (!success) {
      this.success = false;
      this.notCoveredFiles++;
    }
  }

  /**
   * Called once all files have been processed. Outputs the report.
   * @return {Promise<Error, String>} Resolved with the report or an error.
   */
  finish() {
    return Promise.resolve();
  }

}
