import React from 'react';
import ReactDOM from 'react-dom/server';

import {Flux, Container} from '../flux';
import bindActions from '../utils/bindActions';
import * as stores from '../stores';
import * as ProjectAction from '../actions/ProjectAction';
import * as TokenAction from '../actions/TokenAction';
import * as UserAction from '../actions/UserAction';
import HtmlDocument from './HtmlDocument';
import readWebpackStats from '../server/readWebpackStats';
import generateScript from './generateScript';

export default function(req, res, next){
  const flux = new Flux(stores);
  const {checkToken} = bindActions(TokenAction, flux);
  const {loadCurrentUser} = bindActions(UserAction, flux);
  const {getFullProject} = bindActions(ProjectAction, flux);
  const {AppStore} = flux.getStore();
  const projectID = req.params.id;

  let stats;

  AppStore.setPageTitle('Preview');

  readWebpackStats(req).then(webpackStats => {
    stats = webpackStats;

    return checkToken(req.session.token).catch(() => {
      req.session.token = null;
    });
  }).then(() => {
    return loadCurrentUser();
  }).then(() => {
    return getFullProject(projectID);
  }).then(() => {
    let script = 'window.$INIT = function(){"use strict";\n' + generateScript(flux, projectID) + '}';

    let html = ReactDOM.renderToStaticMarkup(
      React.createElement(Container, {flux},
        React.createElement(HtmlDocument, {stats, projectID, script})
      )
    );

    res.status(AppStore.getStatusCode());
    res.send('<!DOCTYPE html>' + html);
  }).catch(next);
}
