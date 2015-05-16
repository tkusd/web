import config from './config';
import {merge} from 'lodash';
import webpack from 'webpack';
import writeStats from './utils/write-stats';

export default merge({}, config, {
  devtool: 'source-map',
  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimize
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    // stats
    function(){
      this.plugin('done', writeStats);
    }
  ]
});
