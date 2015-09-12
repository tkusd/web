import config from './config';
import merge from 'lodash/object/merge';
import webpack from 'webpack';
import notifyStats from './utils/notify-stats';
import loadConfig from '../src/utils/loadConfig';

const serverConfig = loadConfig();
const WEBPACK_HOST = serverConfig.host;
const WEBPACK_PORT = serverConfig.port + 1;

const HOT_LOAD_SCRIPTS = [
  `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
  'webpack/hot/only-dev-server'
];

export default merge({}, config, {
  server: {
    host: WEBPACK_HOST,
    port: WEBPACK_PORT
  },
  devtool: 'eval',
  entry: {
    main: [].concat(HOT_LOAD_SCRIPTS, config.entry.main),
    embed: [].concat(HOT_LOAD_SCRIPTS, config.entry.embed),
    embed_ios: [].concat(HOT_LOAD_SCRIPTS, config.entry.embed_ios),
    embed_material: [].concat(HOT_LOAD_SCRIPTS, config.entry.embed_material)
  },
  module: {
    loaders: config.module.loaders.concat([
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel?cacheDirectory'],
        exclude: /node_modules/
      },
      {
        test: /\.css(\?theme=\w+)?$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.styl$/,
        loader: 'style!css!postcss!stylus'
      },
      {
        test: /\.less$/,
        loader: 'style!css!postcss!less'
      }
    ])
  },
  output: {
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}/build/`
  },
  plugins: config.plugins.concat([
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    // env variables
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true)
      }
    }),

    // optimize
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),

    // stats
    function(){
      this.plugin('done', notifyStats);
    }
  ])
});
