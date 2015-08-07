import webpack from 'webpack/lib/webpack.web';
import FakeFileSystem from './FakeFileSystem';
import path from 'path';
import merge from 'lodash/object/merge';

const BASE_PATH = path.join(__dirname, '../../');
const SOURCE_FILE = 'source.js';
const BUILD_FILE = 'build.js';

export const config = {
  context: BASE_PATH,
  entry: SOURCE_FILE,
  output: {
    path: BASE_PATH,
    filename: BUILD_FILE
  },
  resolve: {
    root: BASE_PATH,
    extensions: ['', '.js', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};

export default function webpackCompile(script, options){
  const fs = new FakeFileSystem();

  options = merge({}, config, options, {
    inputFileSystem: fs,
    outputFileSystem: fs
  });

  const compiler = webpack(options);

  fs.mkdirpSync(BASE_PATH);
  fs.writeFileSync(path.join(BASE_PATH, SOURCE_FILE), script);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err);

      const jsonStats = stats.toJson();

      if (jsonStats.errors.length){
        return reject(new Error(jsonStats.errors[0]));
      }

      if (jsonStats.warnings.length){
        console.error(jsonStats.warnings[0]);
      }

      resolve(fs.readFileSync(path.join(BASE_PATH, BUILD_FILE), 'utf8'));
    });
  });
}
