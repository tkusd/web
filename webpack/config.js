import path from 'path';

const assetPath = path.join(__dirname, '../public/assets');

export default {
  entry: {
    main: ['./src/client.js']
  },
  output: {
    path: assetPath,
    filename: '[name].js',
    chunkFilename: '[id].js',
    publicPath: '/assets/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
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
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
      }
    ]
  },
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
