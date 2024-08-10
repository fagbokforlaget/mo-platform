const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const libraryName = 'moauth';

let config = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({terserOptions: {ecma:5}})]
  },
  entry: [__dirname + '/src/index.js'],
  output: {
    path: __dirname + '/dist',
    filename: libraryName + '.bundle.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({ options: {} }),
  ]
};

module.exports = (argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }
  return config;

};
