//
// Copyright 2019 DXOS.org
//

const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const PUBLIC_URL = process.env.PUBLIC_URL || '';

module.exports = {
  devtool: 'eval-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    disableHostCheck: true,
    port: 8080,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600
    }
  },

  node: {
    fs: 'empty'
  },

  entry: './src/client/main.js',

  output: {
    path: `${__dirname}/dist/client`,
    filename: '[name].bundle.js',
    publicPath: PUBLIC_URL
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name (module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            if (packageName.startsWith('@dxos')) {
              return 'dxos';
            }

            if (packageName.startsWith('@material-ui')) {
              return 'material-ui';
            }

            return 'vendor';
          }
        }
      }
    }
  },

  plugins: [
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebPackPlugin({
      template: './public/index.html',
      templateParameters: {
        title: 'DXOS Kubenet Console'
      }
    }),

    // https://www.npmjs.com/package/dotenv-webpack#properties
    new Dotenv({
      path: process.env.DOT_ENV || '.env'
    }),

    // NOTE: Must be defined below Dotenv (otherwise will override).
    // https://webpack.js.org/plugins/environment-plugin
    new webpack.EnvironmentPlugin({})
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },

      // https://github.com/eemeli/yaml-loader
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      }
    ]
  },

  resolve: {
    alias: {
      '@material-ui/styles': path.resolve(__dirname, '..', '..', 'node_modules/@material-ui/styles'),
      'react': path.resolve(__dirname, '..', '..', 'node_modules/react'),
      'react-dom': path.resolve(__dirname, '..', '..', 'node_modules/react-dom')
    }
  }
};
