import ESDocCoverage from './index';

(ESDocCoverage.withArgs(process.argv.slice(2))).run()
  .catch(err => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);

    process.exitCode = 1;
  });
