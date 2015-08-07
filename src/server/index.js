import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import morgan from 'morgan';
import csurf from 'csurf';
import serveStatic from 'serve-static';
import loadConfig from '../utils/loadConfig';

require('./loadIntlPolyfill');

// Create a server
const server = express();
const NODE_ENV = server.get('env');
const PRODUCTION = NODE_ENV === 'production';
const config = loadConfig();

server.set('trust proxy', 1);
server.set('x-powered-by', false);

// Middleware
server.use(morgan(PRODUCTION ? 'combined' : 'dev'));
server.use(bodyParser.json());
server.use(cookieSession({
  keys: config.secret,
  maxAge: 1000 * 60 * 60 * 24 * 30 // 1 month
}));
server.use(compression());
server.use(csurf());

if (PRODUCTION){
  // On production, use the public directory for static files
  // This directory is created by webpack on build time.
  server.use(serveStatic(path.join(__dirname, '../../public'), {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
    index: false
  }));
} else {
  require('../../webpack/server');
}

// Internal API
server.use('/_api', require('./api'));
server.get('/logout', require('./logout'));
server.get('/projects/:id/preview', require('../preview'));

// Render the app server-side and send it as response.
server.get('/*', require('./render'));

server.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).send('Server error');
});

server.listen(config.port, config.host, () => {
  console.log('Server listening on port %s:%d', config.host, config.port);
});
