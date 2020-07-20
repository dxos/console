//
// Copyright 2019 DXOS.org
//

const merge = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack-common.config');

module.exports = merge(commonConfig, {
  entry: './src/main.js',

  plugins: [
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebPackPlugin({
      template: './public/index.html',
      templateParameters: {
        title: 'Kubenet Console'
      }
    })
  ]
});
