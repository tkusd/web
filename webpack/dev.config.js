import config from './config';
import {merge} from 'lodash';
import webpack from 'webpack';
import notifyStats from './utils/notify-stats';
import writeStats from './utils/write-stats';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const WEBPACK_HOST = argv.host || 'localhost';
const WEBPACK_PORT = argv.port ? parseInt(argv.port, 10) + 1 : 4001;

export default merge({}, config, {
  server: {
    host: WEBPACK_HOST,
    port: WEBPACK_PORT
  },
  devtool: 'eval',
  entry: {
    main: [].concat([
      `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
      'webpack/hot/only-dev-server'
    ], config.entry.main)
  },
  output: {
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}/assets/`
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
/*
    // print progress
    new webpack.ProgressPlugin(function(percentage, message){
      process.stdout.write('\u001b[0K' + Math.round(percentage * 100) + '%: ' + message + '\u001b[1000D');
    }),
*/
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),

    // optimize
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),

    // stats
    function(){
      this.plugin('done', notifyStats);
    },
    function(){
      this.plugin('done', writeStats);
    }
  ]
});
