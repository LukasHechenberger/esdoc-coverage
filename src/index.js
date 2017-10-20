import { join } from 'path';
import yargs from 'yargs';
import CliReporter from './lib/CliReporter';
import JUnitReporter from './lib/JUnitReporter';

/**
 * Commands ESDocCoverage handles.
 * @type {Object}
 * @property {string} CheckCoverage Checks the documentation coverage.
 */
export const Command = {
  CheckCoverage: 'check-coverage',
};

/**
 * Reporters available
 * @type {Object}
 * @property {string} Cli Use a {@link CliReporter} instance.
 * @property {string} JUnit Use a {@link JUnitReporter} instance.
 */
export const Reporter = {
  Cli: 'cli',
  JUnit: 'junit',
};

/**
 * The main esdoc-coverage class.
 */
export default class ESDocCoverage {

  /**
   * The currently used package version.
   * @type {string}
   */
  static get version() {
    // eslint-disable-next-line global-require
    return require(join(__dirname, '../package.json')).version;
  }

  /**
   * Creates a new ESDocCoverage instance with the given command line arguments.
   * @param {string[]} args The command line arguments to use.
   * @return {ESDocCoverage} The new ESDocCoverage instance.
   */
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
        threshold: {
          alias: 't',
          desc: 'Coverage percentage required',
          type: 'number',
          default: 90,
          coerce: percentage => percentage / 100,
        },
      }), () => (command = Command.CheckCoverage))

      .showHelpOnFail(false, 'Specify --help for available options')
      .argv;

    return new this(options, command);
  }

  /**
   * Creates a new ESDocCoverage instance based on some options and the command to run.
   * @param {Object} [options={}] The options to use.
   * @param {string} [options.reporter='cli'] The reporter to use.
   * @param {string} [options.config] The esdoc config path.
   * @param {string} [command] The command to run. Note that you have to call ESDocCoverage#run to
   * run the command specified.
   */
  constructor(options = {}, command) {
    /**
     * The options the current instance was created with.
     * @type {Object}
     */
    this.options = options;

    /**
     * The command to run.
     * @type {?string}
     */
    this._command = command;
  }

  /**
   * Searches the given paths for valid ESDoc configurations.
   * @param {string[]} paths The paths to search.
   * @return {Promise<Error, Object>} Fulfilled with the ESDoc config found or rejected with the
   * error that occured.
   */
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

  /**
   * Gets the documentation coverage report for the given config.
   * @param {Object} config An ESDoc configuration.
   * @return {Promise<Error, Object>} Fulfilled with the coverage report found or rejected with the
   * error that occured.
   */
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

  /**
   * Validates the documentation coverage reported in the given report matches the threshold
   * specified.
   * @param {Object} report The report to handle.
   */
  _checkCoverageReport(report) {
    const reporter = this.options.reporter === 'cli' ? new CliReporter() : new JUnitReporter();

    Object.keys(report.files).sort().forEach(filename => {
      const fileCoverage = report.files[filename];
      const valid = fileCoverage.actualCount / fileCoverage.expectCount >= this.options.threshold;

      reporter.report(filename, valid, fileCoverage.actualCount, fileCoverage.expectCount,
        fileCoverage.undocumentLines);
    });

    return reporter.finish();
  }

  /**
   * Checks the documentation coverage.
   * @return {Promise<Error>} Rejected if any errors occur.
   */
  checkCoverage() {
    const getConfig = this.options.config ?
      this._getESDocConfig([this.options.config]) :
      this._getESDocConfig(['.esdoc.json', '.esdoc.js', 'package.json']);

    return getConfig
      .then(config => this._getCoverageReport(config))
      .then(report => this._checkCoverageReport(report))
      .then(report => console.log(report)); // eslint-disable-line no-console
  }

  /**
   * Runs the specified command
   * @param {Command} [command] The command to run. If not provided it is assumed, that a command
   * was passed to the constructor.
   * @return {Promise<Error>} A promise that is rejected if the command fails.
   */
  run(command) {
    if (!this._command && !command) {
      return Promise.reject(new Error('No command specified'));
    }

    const commandToRun = (command || this._command);

    switch (commandToRun) {
      case Command.CheckCoverage:
        return this.checkCoverage();
      default:
        return Promise.reject(new Error(`Invalid command "${commandToRun}"`));
    }
  }

}
