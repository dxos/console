//
// Copyright 2020 DXOS.org
//

const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

const { ConfigPlugin } = require('@dxos/config/ConfigPlugin');
const isDevelopment = process.env.NODE_ENV !== 'production';

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
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
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
