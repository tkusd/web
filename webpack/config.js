import path from 'path';

const assetPath = path.join(__dirname, '../public/assets');

export default {
  entry: {
    main: ['./src/client.js']
  },
  output: {
    path: assetPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
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
      }
    ]
  },
  progress: true
};
