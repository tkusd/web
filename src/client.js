require('babel-core/polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import routes from './routes';
import {Container, Flux} from './flux';
import {history} from 'react-router/lib/BrowserHistory';
import * as stores from './stores';

const flux = new Flux(stores, window.$STATE);
const {AppStore, LocaleStore} = flux.getStore();
const lang = LocaleStore.getLanguage();

function onRouteUpdate(){
  AppStore.setFirstRender(false);
}

function render(){
  ReactDOM.render(
    React.createElement(Container, {flux},
      React.createElement(Router, {
        history,
        children: routes(flux),
        onUpdate: onRouteUpdate
      })
    )
  , document.getElementById('root'));
}

// Load English
LocaleStore.setData('en', require('../locales/en'));

switch (lang) {
  case 'en':
    render();
    break;

  case 'zh-TW':
    require.ensure(['../locales/zh-TW'], require => {
      LocaleStore.setData(lang, require('../locales/zh-TW'));
      render();
    }, 'locale-zh-TW');
    break;
}
