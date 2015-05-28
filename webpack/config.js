import path from 'path';

const assetPath = path.join(__dirname, '../public/build');

export default {
  entry: {
    main: ['./src/client.js']
  },
  output: {
    path: assetPath,
    filename: '[name].js',
    chunkFilename: '[id].js',
    publicPath: '/build/'
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
