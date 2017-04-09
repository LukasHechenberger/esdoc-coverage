import expect from 'unexpected';
import JUnitReporter from '../../../src/lib/JUnitReporter';

/** @test {JUnitReporter} */
describe('JUnitReporter', function() {
  /** @test {JUnitReporter#constructor} */
  describe('#constructor', function() {
    it('should initialize results', function() {
      expect((new JUnitReporter()).results, 'to equal', []);
    });
  });

  /** @test {JUnitReporter#report} */
  describe('#report', function() {
    it('should add a testcase', function() {
      const reporter = new JUnitReporter();

      reporter.report('test.js', true, 0, 1, [0, 1]);
      expect(reporter.results, 'to have length', 1);
      expect(reporter.results[0], 'to have own properties', {
        $: {
          classname: 'test.js',
          name: 'should be documented',
        },
      });
    });

    it('should add failure if threshold is not met', function() {
      const reporter = new JUnitReporter();

      reporter.report('test.js', false, 0, 1, [0, 1]);
      expect(reporter.results, 'to have length', 1);
      expect(reporter.results[0], 'to have own properties', {
        failure: [{
          $: { message: 'Missing API documentation' },
          _: 'Lines not documented: 0, 1',
        }],
      });
    });
  });
  
  /** @test {JUnitReporter#finish} */
  describe('#finish', function() {
    it('should resolve with a XML string', function() {
      expect((new JUnitReporter()).finish(), 'when fulfilled', 'to match', /^<\?xml/)
    });
  });
});
