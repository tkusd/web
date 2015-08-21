require('babel-core/register');

var fork = require('child_process').fork;

fork(require.resolve('./index'), process.argv.slice(2));
require('./webpack/server');
