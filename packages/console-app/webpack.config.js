//
// Copyright 2019 DXOS.org
//

const merge = require('webpack-merge');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const commonConfig = require('./webpack-common.config');

module.exports = merge(commonConfig, {
  entry: './src/main.js',

  plugins: [
    new CopyWebPackPlugin({
      patterns: [
        {
          from: '**',
          context: './assets'
        }
      ]
    }),

    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebPackPlugin({
      template: './public/index.html',
      templateParameters: {
        title: 'DXOS Console'
      }
    }),

    // TODO(burdon): Add favicons.
    // https://www.npmjs.com/package/favicons-webpack-plugin

    // https://webpack.js.org/guides/progressive-web-application/
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
});
