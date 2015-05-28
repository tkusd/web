import React from 'react';
import serialize from 'serialize-javascript';
import path from 'path';
import fs from 'graceful-fs';
import {checkToken} from '../actions/TokenAction';
import {loadCurrentUser} from '../actions/UserAction';
import AppStore from '../stores/AppStore';
import {Container} from '../flux';
import Router from 'react-router';
import routes from '../routes';

import app from '../app';
import HtmlDocument from '../components/HtmlDocument';

const STATS_PATH = path.join(__dirname, '../../public/build/webpack-stats.json');

let webpackStats;

function readStats(req){
  if (req.get('env') === 'production' && webpackStats){
    return Promise.resolve(webpackStats);
  }

  return new Promise((resolve, reject) => {
    fs.readFile(STATS_PATH, 'utf8', (err, content) => {
      if (err) return reject(err);

      webpackStats = JSON.parse(content);
      resolve(webpackStats);
    });
  });
}

function render(req, res, next){
  const context = app.createContext();

  // Read webpack stats
  readStats(req).then(() => {
    // Check the token
    return context.executeAction(checkToken, req.session.token).catch(() => {
      req.session.token = null;
    });
  }).then(() => {
    // Load current user
    return context.executeAction(loadCurrentUser);
  }).then(() => {
    const appStore = context.getStore(AppStore);

    appStore.setFirstRender(false);
    appStore.setCSRFToken(req.csrfToken());

    let router = Router.create({
      routes: routes(context),
      location: req.path,
      onAbort: options => {
        let path = options.to ? router.makePath(options.to, options.params, options.query) : '/';
        res.redirect(path);
      },
      onError: next
    });

    router.run((Root, state) => {
      let exposed = 'window.$STATE=' + serialize(context.dehydrate()) + ';';

      let markup = React.renderToString(React.createElement(
        Container,
        {context},
        React.createFactory(Root)()
      ));

      let html = React.renderToStaticMarkup(React.createElement(HtmlDocument, {
        context,
        state: exposed,
        markup,
        script: webpackStats.script,
        style: webpackStats.style
      }));

      res.send('<!DOCTYPE html>' + html);
    });
  }).catch(next);
}

export default render;
