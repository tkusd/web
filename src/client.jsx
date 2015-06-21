require('babel-core/polyfill');

import React from 'react';
import app from './app';
import Router from 'react-router';
import routes from './routes';
import AppStore from './stores/AppStore';
import LocaleStore from './stores/LocaleStore';
import {Container} from './flux';

const root = document.getElementById('root');
const context = app.rehydrate(window.$STATE);
const appStore = context.getStore(AppStore);
const localeStore = context.getStore(LocaleStore);
const lang = localeStore.getLanguage();

const router = Router.create({
  routes: routes(context),
  location: Router.HistoryLocation,
  onError: err => {
    console.error(err);
  }
});

function render(){
  router.run((Root, state) => {
    React.render(
      <Container context={context}>
        <Root/>
      </Container>
    , root);

    if (appStore.isFirstRender()){
      appStore.setFirstRender(false);
    }
  });
}

// Load English
localeStore.setData('en', require('../locales/en'));

if (lang === 'en'){
  render();
} else {
  require([`../locales/${lang}/index.js`], locale => {
    localeStore.setData(lang, locale);
    render();
  });
  /*
  // Load other languages
  const loadLocale = require(`bundle?lazy!../locales/${lang}/index.js`);

  loadLocale(locale => {
    localeStore.setData(lang, locale);
    render();
  });*/
}
