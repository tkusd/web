import path from 'path';

const assetPath = path.join(__dirname, '../public/build');

export default {
  entry: {
    main: ['./src/client']
  },
  output: {
    path: assetPath,
    filename: '[name].js',
    chunkFilename: '[id].js',
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
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  plugins: [],
  progress: true,
  stylus: {
    use: [
      require('nib')()
    ]
  },
  postcss: [
    require('autoprefixer-core')(),
    require('cssnano')()
  ]
};
