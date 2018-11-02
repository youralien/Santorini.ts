var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../../../Deliverables/2/2.2/lib'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  target: 'node',
  mode: 'development'
};
