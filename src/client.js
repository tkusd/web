import React from 'react';
import app from './app';

const mountNode = document.getElementById('app');
const dehydratedState = window.App;

window.React = React; // For chrome dev tool support

app.rehydrate(dehydratedState, (err, context) => {
  if (err) throw err;

  React.render(context.createElement(), mountNode);
});
