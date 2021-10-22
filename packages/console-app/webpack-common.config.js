//
// Copyright 2021 DXOS.org
//

const path = require('path');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const VersionFile = require('webpack-version-file-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

const distDir = path.join(__dirname, 'dist');
const PUBLIC_URL = process.env.PUBLIC_URL || '';

const { ConfigPlugin } = require('@dxos/config/ConfigPlugin');

module.exports = {
  mode: isDevelopment ? 'development' : 'production',

  devtool: isDevelopment ? 'eval-source-map' : false,

  devServer: {
    contentBase: distDir,
    compress: true,
    disableHostCheck: true,
    hotOnly: true,
    port: 8080,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600
    }
  },

  output: {
    path: distDir,
    filename: '[name].bundle.js',
    publicPath: PUBLIC_URL
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
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
    extensions: ['.tsx', '.ts', '.js']
  },

  plugins: [
    new ConfigPlugin({
      path: path.resolve(__dirname, 'config'),
      dynamic: process.env.CONFIG_DYNAMIC
    }),

    new CopyWebPackPlugin({
      patterns: [
        {
          from: '**',
          context: './assets'
        }
      ]
    }),

    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      templateParameters: {
        title: 'DXOS Console' // TODO(burdon): Use config.
      }
    }),

    new VersionFile({
      template: path.join(__dirname, 'version.ejs'),
      packageFile: path.join(__dirname, 'package.json'),
      outputFile: path.join(distDir, 'version.json')
    }),

    // https://www.npmjs.com/package/dotenv-webpack#properties
    new Dotenv({
      path: process.env.DOT_ENV || '.env'
    }),
  ]
};
