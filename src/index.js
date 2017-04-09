import { join } from 'path';
import yargs from 'yargs';
import CliReporter from './lib/CliReporter';
import JUnitReporter from './lib/JUnitReporter';

export const Command = {
  CheckCoverage: 'check-coverage',
};

export default class ESDocCoverage {

  static get version() {
    // eslint-disable-next-line global-require
    return require(join(__dirname, '../package.json')).version;
  }

  static withArgs(args) {
    let command;

    const options = yargs(args)
      .version(() => this.constructor.version)
      .alias('version', 'v')

      .help('help')
      .alias('help', 'h')

      .command(['check-coverage', '*'], 'Check coverage', y => y.options({
        reporter: {
          alias: 'r',
          desc: 'Specify reporter to use',
          choices: ['cli', 'junit'],
          type: 'string',
          default: 'cli',
        },
        config: {
          alias: 'c',
          desc: 'Specify config file',
          type: 'string',
        },
      }), () => (command = Command.CheckCoverage))

      .showHelpOnFail(false, 'Specify --help for available options')
      .argv;

    return new this(options, command);
  }

  constructor(options = {}, command) {
    this.options = options;
    this._command = command;
  }

  _getESDocConfig(paths) {
    const cwd = process.cwd();

    for (let i = 0; i < paths.length; i++) {
      const relPath = paths[i];
      const path = join(cwd, relPath);

      try {
        let config = require(path); // eslint-disable-line global-require

        if (relPath === 'package.json') {
          config = config.esdoc;
        }

        if (config) {
          return Promise.resolve({ path, config });
        }
      } catch (e) {} // eslint-disable-line no-empty
    }

    return Promise.reject(
      new Error(`Unable to find ESDoc configuration (Searched: ${paths.join(', ')})`)
    );
  }

  _getCoverageReport(config) {
    const coveragePath = join(config.path, '../', config.config.destination, 'coverage.json');

    try {
      return Promise.resolve(require(coveragePath)); // eslint-disable-line global-require
    } catch (e) {
      return Promise.reject(
        new Error(`Unable to find coverage report (Searched: ${coveragePath})`)
      );
    }
  }

  _checkCoverageReport(report) {
    const reporter = this.options.reporter === 'cli' ? new CliReporter() : new JUnitReporter();

    Object.keys(report.files).sort().forEach(filename => {
      const fileCoverage = report.files[filename];

      reporter.report(filename, false, fileCoverage.actualCount, fileCoverage.expectCount,
        fileCoverage.undocumentLines);
    });

    reporter.finish();
  }

  checkCoverage(options) {
    const getConfig = options.config ?
      this._getESDocConfig([options.config]) :
      this._getESDocConfig(['.esdoc.json', '.esdoc.js', 'package.json']);

    return getConfig
      .then(config => this._getCoverageReport(config))
      .then(report => this._checkCoverageReport(report));
  }

  run(command) {
    if (!this._command && !command) {
      return Promise.reject(new Error('No command specified'));
    }

    const commandToRun = (command || this._command);

    // TODO: Check if command is valid

    switch (commandToRun) {
      case Command.CheckCoverage:
        return this.checkCoverage(this.options);
      default:
        return Promise.reject(new Error(`Invalid command "${commandToRun}"`));
    }
  }

}
