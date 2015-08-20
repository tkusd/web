import config from './config';
import merge from 'lodash/object/merge';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default merge({}, config, {
  devtool: 'source-map',
  output: {
    filename: '[name]-[hash:8].js',
    chunkFilename: '[name]-[chunkhash:8].js'
  },
  module: {
    loaders: config.module.loaders.concat([
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        exclude: /node_modules/
      },
      {
        test: /\.css(\?theme=\w+)?$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!stylus')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!less')
      }
    ])
  },
  plugins: config.plugins.concat([
    // extract css files
    new ExtractTextPlugin('[name]-[contenthash:8].css'),

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
    })
  ])
});
