//
// Copyright 2020 DXOS.org
//

const path = require('path');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const VersionFile = require('webpack-version-file-plugin');

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

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new VersionFile({
      template: path.join(__dirname, 'version.ejs'),
      packageFile: path.join(__dirname, 'package.json'),
      outputFile: path.join(__dirname, 'version.json')
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
        title: 'DXOS Console'
      }
    })
  ]
};
