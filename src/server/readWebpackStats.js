import fs from 'graceful-fs';
import path from 'path';

import promisify from '../utils/promisify';

const readFile = promisify(fs.readFile);
const STATS_PATH = path.join(__dirname, '../../public/build/webpack-stats.json');

let webpackStats;

export default function readWebpackStats(req){
  if (req.get('env') === 'production' && webpackStats){
    return Promise.resolve(webpackStats);
  }

  return readFile(STATS_PATH, 'utf8').then(content => {
    webpackStats = JSON.parse(content);
    return webpackStats;
  });
}
