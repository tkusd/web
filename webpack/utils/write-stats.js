import fs from 'graceful-fs';
import pathFn from 'path';
import mkdirs from './mkdirs';

const STATS_FILENAME = 'webpack-stats.json';

function writeStats(stats){
  let publicPath = this.options.output.publicPath;
  let json = stats.toJson();

  function getChunks(name, ext){
    ext = ext || 'js';
    var chunk = json.assetsByChunkName[name];

    if (!Array.isArray(chunk)){
      chunk = [chunk];
    }

    return chunk
      .filter(chunk => pathFn.extname(chunk) === '.' + ext)
      .map(chunk => publicPath + chunk);
  }

  let content = {
    script: getChunks('main', 'js'),
    css: getChunks('main', 'css')
  };

  mkdirs(this.options.output.path);
  fs.writeFileSync(pathFn.join(this.options.output.path, STATS_FILENAME), JSON.stringify(content));
}

module.exports = writeStats;
