import React from 'react';
import ReactDOM from 'react-dom/server';

import {Container} from '../flux';
import HtmlDocument from './HtmlDocument';
import readWebpackStats from '../server/readWebpackStats';
import generateScript from './generateScript';
import prepareFullProject from '../server/prepareFullProject';

export default function(req, res, next){
  const projectID = req.params.id;
  const flux = req.flux;

  Promise.all([
    readWebpackStats(req),
    prepareFullProject(req)
  ]).then(([stats]) => {
    const {AppStore} = flux.getStore();
    let script = 'window.$INIT = function(){' + generateScript(flux, projectID) + '}';

    let html = ReactDOM.renderToStaticMarkup(
      React.createElement(Container, {flux},
        React.createElement(HtmlDocument, {stats, projectID, script})
      )
    );

    res.status(AppStore.getStatusCode());
    res.send('<!DOCTYPE html>' + html);
  }).catch(err => {
    if (err.response && err.response.status === 404){
      return res.status(404).send('Not found');
    }

    throw err;
  });
}
