import config from './config';
import {merge} from 'lodash';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import writeStats from './utils/write-stats';

export default merge({}, config, {
  devtool: 'source-map',
  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[id]-[chunkhash].js'
  },
  module: {
    loaders: config.module.loaders.slice(0, config.module.loaders.length - 1).concat({
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
    })
  },
  plugins: [
    // extract css files
    new ExtractTextPlugin('[name]-[chunkhash].css', {
      allChunks: true
    }),

    // env variables
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true)
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
