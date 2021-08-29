//
// Copyright 2021 DXOS.org
//

const path = require('path');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const webpack = require('webpack');
const VersionFile = require('webpack-version-file-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

const PUBLIC_URL = process.env.PUBLIC_URL || '';

const CONFIG_FILE = path.relative('./src', process.env.CONFIG_FILE || 'config.yml');

module.exports = {
  mode: isDevelopment ? 'development' : 'production',

  devtool: isDevelopment ? 'eval-source-map' : false,

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    disableHostCheck: true,
    hotOnly: true,
    port: 8080,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600
    }
  },

  entry: './src/main.tsx',

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
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
      outputFile: path.join(__dirname, 'version.json')
    }),

    // https://www.npmjs.com/package/dotenv-webpack#properties
    new Dotenv({
      path: process.env.DOT_ENV || '.env'
    }),

    // Define the build config file based on the target.
    // https://webpack.js.org/plugins/normal-module-replacement-plugin
    new webpack.NormalModuleReplacementPlugin(/(.*)__CONFIG_FILE__/, (resource) => {
      resource.request = resource.request.replace(/__CONFIG_FILE__/, CONFIG_FILE);
    })
  ]
};
