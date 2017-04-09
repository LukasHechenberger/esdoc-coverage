import expect from 'unexpected';
import { stub } from 'sinon';
import CliReporter from '../../../src/lib/CliReporter';

/** @test {CliReporter} */
describe('CliReporter', function() {
  /** @test {CliReporter#constructor} */
  describe('#constructor', function() {
    it('should initialize a cli-table Table', function() {
      expect((new CliReporter()).table, 'to be defined');
    });
  });

  /** @test {CliReporter#addRow} */
  describe('#addRow', function() {
    it('should call cli-table~Table#push', function() {
      const reporter = new CliReporter();
      stub(reporter.table, 'push').callsFake(() => {});

      reporter.addRow('name', false, 0, 2, [1, 2]);
      expect(reporter.table.push.calledOnce, 'to be true');
    });
  });

  /** @test {CliReporter#report} */
  describe('#report', function() {
    it('should forward args to addRow', function() {
      const reporter = new CliReporter();
      stub(reporter, 'addRow').callsFake(() => {});
      const args = ['name', false, 0, 2, [1, 2]];

      reporter.report(...args);
      expect(reporter.addRow.calledOnce, 'to be true');
      expect(reporter.addRow.lastCall.args, 'to equal', args);
    });
  });
  
  /** @test {CliReporter#finish} */
  describe('#finish', function() {
    it('should add a summary row', function() {
      const reporter = new CliReporter();
      stub(reporter, 'addRow').callsFake(() => {});

      reporter.finish();
      expect(reporter.addRow.calledOnce, 'to be true');
    });

    it('should set process exit code', function() {
      const reporter = new CliReporter();
      reporter.report('name', false, 0, 2, [1, 2]);

      reporter.finish();
      expect(process.exitCode, 'to equal', 1);
    });
  });
});
