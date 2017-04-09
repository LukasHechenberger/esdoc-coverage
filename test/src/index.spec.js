import { join } from 'path';
import expect from 'unexpected';
import { stub } from 'sinon';
import ESDocCoverage, { Command } from '../../src/index';
import esDocConfig from '../../esdoc.json';

/** @test {ESDocCoverage} */
describe('ESDocCoverage', function() {
  /** @test {ESDocCoverage.version} */
  describe('.version', function() {
    it('should return current package version', function() {
      expect(ESDocCoverage.version, 'to match', /[0-9]+\.[0-9]+\.[0-9]+/);
    });
  });

  /** @test {ESDocCoverage.withArgs} */
  describe('.withArgs', function() {
    it('should return a set up instance', function() {
      expect(ESDocCoverage.withArgs([]), 'to be a', ESDocCoverage);
    });
  });

  /** @test {ESDocCoverage#constructor} */
  describe('#constructor', function() {
    it('should work without any arguments', function() {
      expect(() => new ESDocCoverage(), 'not to throw');
    });

    it('should store options passed', function() {
      const opts = { test: 123 };
      expect((new ESDocCoverage(opts)).options, 'to be', opts);
    });

    it('should store command passed', function() {
      const command = Command.CheckCoverage;
      expect((new ESDocCoverage({}, command))._command, 'to be', Command.CheckCoverage);
    });
  });

  /** @test {ESDocCoverage#_getESDocConfig} */
  describe('#_getESDocConfig', function() {
    const instance = new ESDocCoverage({});

    it('should fail with invalid path', function() {
      return expect(instance._getESDocConfig(['does/not/exist.json']),
        'to be rejected with', /Unable to find ESDoc config/);
    });

    it('should use esdoc property on package.json files', function() {
      return expect(instance._getESDocConfig(['package.json']),
        'to be rejected with', /Unable to find ESDoc config/);
    });

    it('should be fulfilled if config exists', function() {
      return expect(instance._getESDocConfig(['esdoc.json']),
        'when fulfilled', 'to have properties', {
          config: esDocConfig,
          path: join(__dirname, '../../esdoc.json'),
        });
    });
  });

  /** @test {ESDocCoverage#_getCoverageReport} */
  describe('#_getCoverageReport', function() {
    const instance = new ESDocCoverage({});

    it('should fail with invalid path', function() {
      return expect(instance._getCoverageReport({
        path: 'does/not/exist.json',
        config: { destination: 'docs/api' },
      }),
        'to be rejected with', /Unable to find coverage report/);
    });

    it('should work with valid path', function() {
      return expect(instance._getCoverageReport({
        path: join(__dirname, '../../esdoc.json'),
        config: { destination: 'docs/api' } }),
        'to be fulfilled');
    });
  });

  /** @test {ESDocCoverage#checkCoverage} */
  describe('#checkCoverage', function() {
    it('should call getConfig with passed option value', function() {
      const instance = new ESDocCoverage({ config: 'test.json' });
      stub(instance, '_getESDocConfig', () => Promise.resolve());
      stub(instance, '_getCoverageReport', () => Promise.resolve());
      stub(instance, '_checkCoverageReport', () => Promise.resolve());

      instance.checkCoverage();

      expect(instance._getESDocConfig.calledOnce, 'to be true');
      expect(instance._getESDocConfig.lastCall.args[0], 'to equal', ['test.json']);
    });

    it('should call getConfig with default config paths if no option passed', function() {
      const instance = new ESDocCoverage({});
      stub(instance, '_getESDocConfig', () => Promise.resolve());
      stub(instance, '_getCoverageReport', () => Promise.resolve());
      stub(instance, '_checkCoverageReport', () => Promise.resolve());

      instance.checkCoverage();

      expect(instance._getESDocConfig.calledOnce, 'to be true');
      expect(instance._getESDocConfig.lastCall.args[0], 'to equal', [
        '.esdoc.json',
        '.esdoc.js',
        'package.json'
      ]);
    });
  });

  /** @test {ESDocCoverage#run} */
  describe('#run', function() {
    it('should fail without command', function() {
      return expect((new ESDocCoverage()).run(), 'to be rejected with', /No command/);
    });

    it('should fail with invalid command', function() {
      return expect((new ESDocCoverage({}, 'unknown')).run(),
        'to be rejected with', /Invalid command/);
    });

    it('should always run passed command if defined', function() {
      return expect((new ESDocCoverage({}, Command.CheckCoverage)).run('unknown'),
        'to be rejected with', /Invalid command/);
    });

    it('should call checkCoverage for CheckCoverage command', function() {
      const instance = new ESDocCoverage({}, Command.CheckCoverage);
      stub(instance, 'checkCoverage');

      instance.run();

      expect(instance.checkCoverage.calledOnce, 'to be true');
    });
  });
});
