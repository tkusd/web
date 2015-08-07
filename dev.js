delete process.env.BROWSER;

var fork = require('child_process').fork;

require('babel-core/register');

require('./webpack/server');

fork(require.resolve('./index'));
