//
// Copyright 2021 DXOS.org
//

const HtmlWebPackPlugin = require('html-webpack-plugin');

const path = require('path');

const distDir = path.join(__dirname, 'dist');
const PUBLIC_URL = process.env.PUBLIC_URL || '';

module.exports = {
  entry: './src/index.js',

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

  devServer: {
    inline: true,
    port: 8080
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      templateParameters: {
        title: 'DXOS Console'
      }
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