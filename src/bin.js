#!/usr/bin/env node

import ESDocCoverage from './index';

(ESDocCoverage.withArgs(process.argv.slice(2))).run()
  .catch(err => {
    console.error(err); // eslint-disable-line no-console

    process.exitCode = 1;
  });
