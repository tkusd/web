import React from 'react';
import ReactDOM from 'react-dom/server';
import path from 'path';
import fs from 'graceful-fs';
import Router from 'react-router';
import Location from 'react-router/lib/Location';

import {Flux, Container} from '../flux';
import routes from '../routes';
import HtmlDocument from './HtmlDocument';
import promisify from '../utils/promisify';
import bindActions from '../utils/bindActions';
import * as stores from '../stores';
import * as TokenAction from '../actions/TokenAction';
import * as UserAction from '../actions/UserAction';

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

function render(req, res, next){
  const flux = new Flux(stores);
  const lang = req.locale;
  const {checkToken} = bindActions(TokenAction, flux);
  const {loadCurrentUser} = bindActions(UserAction, flux);

  readStats(req).then(() => {
    // Check web token
    return checkToken(req.session.token).catch(() => {
      req.session.token = null;
    });
  }).then(() => {
    return loadCurrentUser();
  }).then(() => {
    const {AppStore, LocaleStore} = flux.getStore();
    const location = new Location(req.path, req.query);

    AppStore.setFirstRender(false);
    AppStore.setCSRFToken(req.csrfToken());

    LocaleStore.setData('en', require('../../locales/en'));

    if (lang !== 'en'){
      LocaleStore.setLanguage(lang);
      LocaleStore.setData(lang, require('../../locales/' + lang));
    }

    Router.run(routes(flux), location, (err, initialState, transition) => {
      if (err) return next(err);

      if (transition.isCancelled && transition.redirectInfo){
        return res.redirect(transition.redirectInfo.pathname);
      }

      let markup = ReactDOM.renderToString(
        React.createElement(Container, {flux},
          React.createElement(Router, initialState)
        )
      );

      let html = ReactDOM.renderToStaticMarkup(
        React.createElement(HtmlDocument, {flux, markup, stats: webpackStats})
      );

      res.status(AppStore.getStatusCode());
      res.send('<!DOCTYPE html>' + html);
    });
  });
}

export default render;
