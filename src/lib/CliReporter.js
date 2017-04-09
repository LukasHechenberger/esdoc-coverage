import Table from 'cli-table';
import colors from 'chalk';
import Reporter from './Reporter';

/**
 * A reporter that prints an ASCII table with all files and their coverage values.
 */
export default class CliReporter extends Reporter {

  /**
   * Creates a new CliReporter.
   */
  constructor() {
    super();

    /**
     * The table to print.
     * @type {cli-table~Table}
     */
    this.table = new Table({
      head: ['', colors.cyan('Coverage'), 'Uncovered lines'],
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
      [colors.white(name)]: [
        [
          colors[success ? 'green' : 'red'](`${((actual / expected) * 100).toFixed(1)}%`),
          colors.gray(`(${actual}/${expected})`),
        ].join(' '),
        `${uncoveredLines.join(', ')}`,
      ],
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
   */
  finish() {
    this.addRow(colors.cyan('All files'), this.success, this.actual, this.expected, []);

    console.log(this.table.toString()); // eslint-disable-line no-console

    process.exitCode = this.success ? 0 : 1;
  }

}
