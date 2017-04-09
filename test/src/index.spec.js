import expect from 'unexpected';
import ESDocCoverage from '../../src/index';

/** @test {ESDocCoverage} */
describe('ESDocCoverage', function() {
  /** @test {EsdocCoverage.version} */
  describe('.version', function() {
    it('should return current package version', function() {
      expect(ESDocCoverage.version, 'to match', /[0-9]+\.[0-9]+\.[0-9]+/);
    });
  });
});
