import React from 'react';
import app from './app';
import Router from 'react-router';
import {FluxibleComponent} from 'fluxible/addons';
import routes from './routes';

const mountNode = document.getElementById('app');
const dehydratedState = window.$STATE;

app.rehydrate(dehydratedState, (err, context) => {
  if (err) throw err;

  Router.run(routes(context.getActionContext()), Router.HistoryLocation, (Root, state) => {
    let Component = React.createFactory(Root);

    React.render(React.createElement(
      FluxibleComponent,
      {context: context.getComponentContext()},
      Component()
    ), mountNode);
  });
});
