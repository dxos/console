//
// Copyright 2021 DXOS.org
//

const path = require('path');
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const isDevelopment = process.env.NODE_ENV !== 'production';
const VersionFile = require('webpack-version-file-plugin');
const { ConfigPlugin } = require('@dxos/config/ConfigPlugin');

const distDir = path.join(__dirname, 'dist');
const PUBLIC_URL = process.env.PUBLIC_URL || '';

module.exports = {
  entry: './src/main.tsx',
  devtool: isDevelopment ? 'eval-source-map' : false,
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  node: {
    fs: 'empty'
  },
  output: {
    path: distDir,
    filename: '[name].bundle.js',
    publicPath: PUBLIC_URL
  },
  plugins: [
    new ConfigPlugin({
      path: path.resolve(__dirname, 'config'),
      dynamic: process.env.CONFIG_DYNAMIC
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      title: 'Konsole' // TODO(burdon): From config.
    })
  ]
};
