import expect from 'unexpected';
import Reporter from '../../../src/lib/Reporter';

/** @test {Reporter} */
describe('Reporter', function() {
  /** @test {Reporter#constructor} */
  describe('#constructor', function() {
    it('should set initial values', function() {
      expect((new Reporter()), 'to have own properties', {
        actual: 0,
        expected: 0,
        success: true,
        numberOfFiles: 0,
        notCoveredFiles: 0,
      });
    });
  });

  /** @test {Reporter#report} */
  describe('#report', function() {
    it('should increase values', function() {
      const reporter = new Reporter();
      reporter.report('test.js', false, 2, 4);

      expect(reporter, 'to have own properties', {
        numberOfFiles: 1,
        actual: 2,
        expected: 4,
        success: false,
        notCoveredFiles: 1,
      });
    });

    it('should should keep previous success value if successful', function() {
      const reporter = new Reporter();
      reporter.report('test.js', true, 2, 4);

      expect(reporter, 'to have own properties', {
        numberOfFiles: 1,
        actual: 2,
        expected: 4,
        success: true,
        notCoveredFiles: 0,
      });
    });
  });

  /** @test {Reporter#finish} */
  describe('#finish', function() {
    it('should return a fulfilled Promise by default', function() {
      expect((new Reporter()).finish(), 'to be fulfilled');
    });
  });
});
