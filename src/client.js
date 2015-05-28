require('babel-core/polyfill');

import React from 'react';
import app from './app';
import Router from 'react-router';
import routes from './routes';
import AppStore from './stores/AppStore';
import {Container} from './flux';

const root = document.getElementById('root');
const context = app.rehydrate(window.$STATE);

const router = Router.create({
  routes: routes(context),
  location: Router.HistoryLocation,
  onError: err => {
    console.error(err);
  }
});

router.run((Root, state) => {
  let appStore = context.getStore(AppStore);

  React.render(React.createElement(
    Container,
    {context},
    React.createFactory(Root)()
  ), root);

  if (appStore.isFirstRender()){
    appStore.setFirstRender(false);
  }
});
