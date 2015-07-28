import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from 'react-router';
import Location from 'react-router/lib/Location';

import {Flux, Container} from '../flux';
import routes from '../routes';
import HtmlDocument from './HtmlDocument';
import bindActions from '../utils/bindActions';
import availableLocales from './availableLocales';
import * as stores from '../stores';
import * as TokenAction from '../actions/TokenAction';
import * as UserAction from '../actions/UserAction';
import readWebpackStats from './readWebpackStats';

const DEFAULT_LOCALE = 'en';

function render(req, res, next){
  const flux = new Flux(stores);
  const lang = req.acceptsLanguages(availableLocales) || DEFAULT_LOCALE;
  const {checkToken} = bindActions(TokenAction, flux);
  const {loadCurrentUser} = bindActions(UserAction, flux);
  let stats;

  readWebpackStats(req).then(webpackStats => {
    stats = webpackStats;

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

    LocaleStore.setLanguage(lang);
    LocaleStore.setData(require('../../locales/' + lang));

    Router.run(routes(flux), location, (err, initialState, transition) => {
      if (err) return next(err);

      if (transition.isCancelled){
        if (transition.redirectInfo){
          res.redirect(transition.redirectInfo.pathname);
        } else {
          next(transition.abortReason);
        }

        return;
      }

      let markup = ReactDOM.renderToString(
        React.createElement(Container, {flux},
          React.createElement(Router, initialState)
        )
      );

      let html = ReactDOM.renderToStaticMarkup(
        React.createElement(HtmlDocument, {flux, markup, stats})
      );

      res.status(AppStore.getStatusCode());
      res.send('<!DOCTYPE html>' + html);
    });
  }).catch(next);
}

export default render;
