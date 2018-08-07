const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

const libraryName = 'moauth';

let config = {
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
      {
        enforce: 'pre',
        test: /\.js$/,
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
  plugins: [
    new webpack.LoaderOptionsPlugin({ options: {} }),
  ]
};

module.exports = (env) => {
  if (env.mode === 'development') {
    config.devtool = 'eval-sourcemap';
  }
  else {
    config.devtool = 'source-map';
    config.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: {
            compress: {
              inline: false
	    },
          },
	}),
      ],
    };
    config.plugins = [
      ...config.plugins,
      new CompressionPlugin(),
    ];
  }
  return config;

};
