require('babel-core/polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import routes from './routes';
import {Container, Flux} from './flux';
import {history} from 'react-router/lib/BrowserHistory';
import * as stores from './stores';
import loadIntl from './utils/loadIntl';

const flux = new Flux(stores, window.$STATE);
const {LocaleStore} = flux.getStore();

loadIntl(flux, LocaleStore.getLanguage()).then(() => {
  ReactDOM.render(
    React.createElement(Container, {flux},
      React.createElement(Router, {
        history,
        children: routes(flux)
      })
    )
  , document.getElementById('root'));
});
