require('babel-core/polyfill');

import React from 'react';
import app from './app';
import Router from 'react-router';
import routes from './routes';
import {Container} from './flux';

const root = document.getElementById('root');
const context = app.rehydrate(window.$STATE);
const {AppStore, LocaleStore, RouteStore} = context.getStore();
const lang = LocaleStore.getLanguage();

const router = Router.create({
  routes: routes(context),
  location: Router.HistoryLocation,
  onError: err => {
    console.error(err);
  }
});

function render(){
  router.run((Root, state) => {
    RouteStore.setState(state);

    React.render(
      <Container context={context}>
        <Root/>
      </Container>
    , root);

    if (AppStore.isFirstRender()){
      AppStore.setFirstRender(false);
    }
  });
}

// Load English
LocaleStore.setData('en', require('../locales/en'));

if (lang === 'en'){
  render();
} else {
  require(`!!promise?global!../locales/${lang}`)().then(locale => {
    LocaleStore.setData(lang, locale);
    render();
  });
}
