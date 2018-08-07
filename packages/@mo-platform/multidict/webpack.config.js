var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'MultiDictClient';

var plugins = [], outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true, sourceMap: true }));
  outputFile = 'multidict.min.js';
} else {
  outputFile = 'multidict.js';
}

var config = {
  entry: [__dirname + '/src/index.js'],
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
			{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [ 'es2015', { modules: false } ]
          ]
        }
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ]
  },
  plugins: plugins
};

module.exports = function(env) {
  if (env === 'production') {
    plugins.push(new UglifyJsPlugin({ minimize: true, sourceMap: true }));
    outputFile = 'multidict.min.js';
  } else {
    outputFile = 'multidict.js';
  }

  return config;
};
