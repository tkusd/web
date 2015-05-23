import React from 'react';
import serialize from 'serialize-javascript';
import path from 'path';
import fs from 'graceful-fs';
import {checkToken} from '../actions/TokenAction';
import {loadCurrentUser} from '../actions/UserAction';
import {setCSRFToken} from '../actions/AppAction';
import TokenStore from '../stores/TokenStore';
import {FluxibleComponent} from 'fluxible/addons';
import Router from 'react-router';
import async from 'async';
import routes from '../routes';

import app from '../app';
import HtmlDocument from '../components/HtmlDocument';

const STATS_PATH = path.join(__dirname, '../../public/assets/webpack-stats.json');

let webpackStats;

function readStats(req, callback){
  if (req.get('env') === 'production' && webpackStats){
    return callback(null, webpackStats);
  }

  fs.readFile(STATS_PATH, 'utf8', function(err, content){
    if (err) return callback(err);

    webpackStats = JSON.parse(content);
    callback(null, webpackStats);
  });
}

function render(req, res, next){
  const context = app.createContext();
  const ctx = context.getComponentContext();

  async.auto({
    // Read webpack stats
    webpackStats: next => { readStats(req, next); },
    // Check the token
    checkToken: next => {
      context.executeAction(checkToken, req.session.token, () => {
        if (!ctx.getStore(TokenStore).isLoggedIn()){
          req.session.token = null;
        }

        next();
      });
    },
    // Create a CSRF token
    csrfToken: next => { context.executeAction(setCSRFToken, req.csrfToken(), next); },
    // Load current user
    currentUser: ['checkToken', next => { context.executeAction(loadCurrentUser, {}, next); }]
  }, (err, results) => {
    if (err) return next(err);

    let {webpackStats} = results;

    let router = Router.create({
      routes: routes(context.getActionContext()),
      location: req.path,
      onAbort: options => {
        let path = options.to ? router.makePath(options.to, options.params, options.query) : '/';
        res.redirect(path);
      },
      onError: err => {
        next(err);
      }
    });

    router.run((Root, state) => {
      let exposed = 'window.$STATE=' + serialize(app.dehydrate(context)) + ';';
      let Component = React.createFactory(Root);

      let markup = React.renderToString(React.createElement(
        FluxibleComponent,
        {context: ctx},
        Component()
      ));

      let html = React.renderToStaticMarkup(
        <HtmlDocument
          context={ctx}
          state={exposed}
          markup={markup}
          script={webpackStats.script}
          style={webpackStats.style}/>
      );

      res.end('<!DOCTYPE html>' + html);
    });
  });
}

export default render;
