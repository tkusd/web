import React from 'react';
import path from 'path';
import fs from 'graceful-fs';
import {checkToken} from '../actions/TokenAction';
import {loadCurrentUser} from '../actions/UserAction';
import {Container} from '../flux';
import Router from 'react-router';
import routes from '../routes';

import app from '../app';
import HtmlDocument from './HtmlDocument';
import promisify from '../utils/promisify';

const readFile = promisify(fs.readFile);
const STATS_PATH = path.join(__dirname, '../../public/build/webpack-stats.json');

let webpackStats;

function readStats(req){
  if (req.get('env') === 'production' && webpackStats){
    return Promise.resolve(webpackStats);
  }

  return readFile(STATS_PATH, 'utf8').then(content => {
    webpackStats = JSON.parse(content);
  });
}

function renderMarkup(context, Root){
  return new Promise((resolve, reject) => {
    try {
      let markup = React.renderToString(React.createElement(
        Container,
        {context},
        React.createFactory(Root)()
      ));

      resolve(markup);
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
    const {AppStore, LocaleStore, RouteStore} = context.getStore();

    AppStore.setFirstRender(false);
    AppStore.setCSRFToken(req.csrfToken());

    LocaleStore.setData('en', require('../../locales/en'));

    if (lang !== 'en'){
      LocaleStore.setLanguage(lang);
      LocaleStore.setData(lang, require('../../locales/' + lang));
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

      RouteStore.setState(state);

      renderMarkup(context, Root).then(markup => {
        let html = React.renderToStaticMarkup(React.createElement(HtmlDocument, {
          context,
          markup,
          stats: webpackStats
        }));

        res.status(AppStore.getStatusCode());
        res.send('<!DOCTYPE html>' + html);
      }).catch(next);
    });
  }).catch(next);
}

export default render;
