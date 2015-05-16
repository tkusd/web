import React from 'react';
import serialize from 'serialize-javascript';
import {navigateAction} from 'fluxible-router';
import fs from 'graceful-fs';
import path from 'path';

import app from '../app';
import HtmlDocument from '../components/HtmlDocument';

const STATS_PATH = path.join(__dirname, '../../public/assets/webpack-stats.json');

let webpackStats;

function readStats(req, callback){
  let env = req.app.get('env');

  if (env === 'production' && webpackStats){
    return callback(null, webpackStats);
  }

  fs.readFile(STATS_PATH, 'utf8', (err, content) => {
    if (err) return callback(err);

    try {
      webpackStats = JSON.parse(content);
      callback(null, webpackStats);
    } catch (err){
      callback(err);
    }
  });
}

function render(req, res, next){
  const context = app.createContext();

  readStats(req, (err, stats) => {
    if (err) return next(err);

    context.executeAction(navigateAction, {url: req.url}, (err) => {
      if (err){
        if (err.statusCode && err.statusCode === 404){
          next();
        } else {
          next(err);
        }
        return;
      }

      let exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

      let html = React.renderToStaticMarkup(
        <HtmlDocument
          state={exposed}
          markup={React.renderToString(context.createElement())}
          context={context.getComponentContext()}
          stats={stats}/>
      );

      res.send('<!DOCTYPE html>' + html);
    });
  });
}

export default render;
