import Table from 'cli-table';
import colors from 'chalk';
import Reporter from './Reporter';

export default class CliReporter extends Reporter {

  constructor() {
    super();

    this.table = new Table({
      head: ['', colors.cyan('Coverage'), 'Uncovered lines'],
    });
  }

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

  report(filename, success, actual, expected, uncoveredLines) {
    super.report(filename, success, actual, expected, uncoveredLines);

    this.addRow(filename, success, actual, expected, uncoveredLines);
  }

  finish() {
    this.addRow(colors.cyan('All files'), this.success, this.actual, this.expected, []);

    console.log(this.table.toString()); // eslint-disable-line no-console

    process.exitCode = this.success ? 0 : 1;
  }

}
