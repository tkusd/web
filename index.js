delete process.env.BROWSER;

require('babel-core/register');

if (true || process.env.NODE_ENV === 'production' || require('piping')({hook: true})){
  require('./src/server');
}
