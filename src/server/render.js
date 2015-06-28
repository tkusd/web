import React from 'react';
import serialize from 'serialize-javascript';
import path from 'path';
import fs from 'graceful-fs';
import {checkToken} from '../actions/TokenAction';
import {loadCurrentUser} from '../actions/UserAction';
import AppStore from '../stores/AppStore';
import LocaleStore from '../stores/LocaleStore';
import RouteStore from '../stores/RouteStore';
import {Container} from '../flux';
import Router from 'react-router';
import routes from '../routes';

import app from '../app';
import HtmlDocument from './HtmlDocument';

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

function renderMarkup(context, Root){
  return new Promise((resolve, reject) => {
    try {
      let result = React.renderToString(React.createElement(
        Container,
        {context},
        React.createFactory(Root)()
      ));

      resolve(result);
    } catch (err){
      reject(err);
    }
  });
}

function render(req, res, next){
  const context = app.createContext();
  const lang = req.locale;
  let isError = false;

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
    const localeStore = context.getStore(LocaleStore);
    const routeStore = context.getStore(RouteStore);

    appStore.setFirstRender(false);
    appStore.setCSRFToken(req.csrfToken());

    localeStore.setData('en', require('../../locales/en'));

    if (lang !== 'en'){
      localeStore.setLanguage(lang);
      localeStore.setData(lang, require('../../locales/' + lang));
    }

    let router = Router.create({
      routes: routes(context),
      location: req.path,
      onAbort: options => {
        let path = options.to ? router.makePath(options.to, options.params, options.query) : '/';
        res.redirect(path);
      },
      onError: err => {
        isError = true;
        next(err);
      }
    });

    router.run((Root, state) => {
      if (isError) return;

      routeStore.setState(state);

      renderMarkup(context, Root).then(markup => {
        let exposed = 'window.$STATE=' + serialize(context.dehydrate()) + ';';
        let html = React.renderToStaticMarkup(React.createElement(HtmlDocument, {
          context,
          state: exposed,
          markup,
          stats: webpackStats
        }));

        res.status(appStore.getStatusCode());
        res.send('<!DOCTYPE html>' + html);
      }).catch(next);
    });
  }).catch(next);
}

export default render;
