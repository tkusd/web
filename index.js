delete process.env.BROWSER;

require('babel-core/register');

if (process.env.NODE_ENV === 'production' || require('piping')({hook: true})){
  require('./src/server');
}
