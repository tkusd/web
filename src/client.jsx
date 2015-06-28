require('babel-core/polyfill');

import React from 'react';
import app from './app';
import Router from 'react-router';
import routes from './routes';
import AppStore from './stores/AppStore';
import LocaleStore from './stores/LocaleStore';
import RouteStore from './stores/RouteStore';
import {Container} from './flux';

const root = document.getElementById('root');
const context = app.rehydrate(window.$STATE);
const appStore = context.getStore(AppStore);
const localeStore = context.getStore(LocaleStore);
const routeStore = context.getStore(RouteStore);
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
    routeStore.setState(state);

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
  require(`!!promise?global!../locales/${lang}`)().then(locale => {
    localeStore.setData(lang, locale);
    render();
  });
}
