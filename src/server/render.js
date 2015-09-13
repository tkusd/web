import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from 'react-router';
import Location from 'react-router/lib/Location';

import {Container} from '../flux';
import routes from '../routes';
import HtmlDocument from './HtmlDocument';
import readWebpackStats from './readWebpackStats';
import checkCurrentUser from './checkCurrentUser';

export default function render(req, res, next){
  const flux = req.flux;
  const {AppStore, LocaleStore} = flux.getStore();
  let stats;

  readWebpackStats(req).then(webpackStats => {
    stats = webpackStats;
    return checkCurrentUser(req);
  }).then(() => {
    const location = new Location(req.path, req.query);
    const lang = LocaleStore.getLanguage();

    AppStore.setFirstRender(false);
    AppStore.setCSRFToken(req.csrfToken());
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
