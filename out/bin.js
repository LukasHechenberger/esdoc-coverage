#!/usr/bin/env node
'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.withArgs(process.argv.slice(2)).run().catch(err => {
  console.error(err); // eslint-disable-line no-console

  process.exitCode = 1;
});