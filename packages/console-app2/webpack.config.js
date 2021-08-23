//
// Copyright 2021 DXOS.org
//

const HtmlWebPackPlugin = require('html-webpack-plugin');
const VersionFile = require('webpack-version-file-plugin');

const path = require('path');

const { ConfigPlugin } = require('@dxos/config/ConfigPlugin');

const distDir = path.join(__dirname, 'dist');
const PUBLIC_URL = process.env.PUBLIC_URL || '';

module.exports = {
  entry: './src/index.tsx',

  devtool: 'eval-source-map',

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

  node: {
    fs: 'empty'
  },

  output: {
    path: distDir,
    filename: '[name].bundle.js',
    publicPath: PUBLIC_URL
  },
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  devServer: {
    inline: true,
    port: 8080
  },

  plugins: [
    new ConfigPlugin({
      path: path.resolve(__dirname, 'config'),
      dynamic: process.env.CONFIG_DYNAMIC
    }),

    new HtmlWebPackPlugin({
      template: './public/index.html',
      templateParameters: {
        title: 'DXOS Console'
      }
    }),

    // https://www.npmjs.com/package/webpack-version-file-plugin
    new VersionFile({
      template: path.join(__dirname, 'version.ejs'),
      packageFile: path.join(__dirname, 'package.json'),
      outputFile: path.join(distDir, 'version.json')
    })
  ],

  module: {
    rules: [
      // js & ts
      {
        test: /\.[jt]sx?$/,
        include: path.resolve(__dirname, './src'),
        exclude: /node_modules/,
        loader: 'ts-loader'
      },

      // config
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: ['yaml-loader']
      },

      // fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg|png|jpg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: PUBLIC_URL
            }
          }
        ]
      }
    ]
  }
};