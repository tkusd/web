import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer-core';
import cssnano from 'cssnano';
import postcssF7 from './postcss-f7';
import loaderUtils from 'loader-utils';
import writeStats from './utils/write-stats';

const assetPath = path.join(__dirname, '../public/build');

let entry = {
  main: ['./src/client'],
  preview: ['./src/preview/client'],
  preview_ios: [
    'framework7/dist/css/framework7.ios.css',
    'framework7/dist/css/framework7.ios.colors.css'
  ],
  preview_material: [
    'framework7/dist/css/framework7.material.css',
    'framework7/dist/css/framework7.material.colors.css'
  ],
  vendor: [
    'react',
    'react-router',
    'immutable',
    'normalize.css',
    'font-awesome/css/font-awesome.css'
  ]
};

export default {
  entry: entry,
  output: {
    path: assetPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/build/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['eslint']
      }
    ],
    loaders: [
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff&name=[name]-[hash:8].[ext]'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream&name=[name]-[hash:8].[ext]'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=[name]-[hash:8].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml&name=[name]-[hash:8].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.png$/,
        loader: 'url?limit=10000&mimetype=image/png&name=[name]-[hash:8].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash:8].js', ['main']),

    function(){
      this.plugin('done', writeStats);
    }
  ],
  progress: true,
  stylus: {
    use: [
      require('nib')()
    ]
  },
  postcss: function(){
    if (this.resourceQuery){
      const query = loaderUtils.parseQuery(this.resourceQuery);

      if (query.theme){
        return [
          postcssF7({
            prefix: '.' + query.theme
          })
        ];
      }
    }

    return [
      autoprefixer(),
      cssnano({
        autoprefixer: false,
        zindex: false,
        reduceIdents: false,
        // Disable convertValues temporarily because postcss-value-parser has bugs
        convertValues: false
      })
    ];
  }
};
