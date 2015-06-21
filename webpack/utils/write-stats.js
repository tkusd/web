import fs from 'graceful-fs';
import pathFn from 'path';
import mkdirs from './mkdirs';

const STATS_FILENAME = 'webpack-stats.json';

function writeStats(stats){
  let publicPath = this.options.output.publicPath;
  let json = stats.toJson();
  let chunks = json.assetsByChunkName;
  let content = {};

  Object.keys(chunks).forEach(key => {
    let assets = chunks[key];
    if (!Array.isArray(assets)) assets = [assets];

    content[key] = assets.map(asset => publicPath + asset);
  });

  mkdirs(this.options.output.path);
  fs.writeFileSync(pathFn.join(this.options.output.path, STATS_FILENAME), JSON.stringify(content));
}

module.exports = writeStats;
