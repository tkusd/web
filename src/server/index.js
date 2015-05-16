import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import csurf from 'csurf';
import minimist from 'minimist';
import render from './render';

// Create a server
const server = express();
const NODE_ENV = server.get('env');
const PRODUCTION = NODE_ENV === 'production';
const argv = minimist(process.argv.slice(2));

// Middleware
server.use(morgan(PRODUCTION ? 'combined' : 'dev'));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(compression());
server.use(csurf({cookie: true}));

if (PRODUCTION){
  // On production, use the public directory for static files
  // This directory is created by webpack on build time.
  server.use(express.static(path.join(__dirname, '../../public'), {
    maxAge: 365 * 24 * 60 * 60
  }));
} else {
  // On development, serve the static files from the webpack dev server.
  require('../../webpack/server');
}

// Render the app server-side and send it as response.
server.use(render);

// Generic server errors (e.g. not caught by components)
server.use((err, req, res, next) => {
  console.log('Error on request %s %s', req.method, req.url);
  console.log(err);
  console.log(err.stack);
  res.status(500).send('Something bad happened');
});

server.set('port', argv.port || 4000);

server.listen(server.get('port'), () => {
  console.log(`Express ${server.get('env')} server listening on ${server.get('port')}`);
});
