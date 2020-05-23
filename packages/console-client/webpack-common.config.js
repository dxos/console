//
// Copyright 2019 DxOS
//

const path = require('path');
const Dotenv = require('dotenv-webpack');
const VersionFile = require('webpack-version-file-plugin');
const webpack = require('webpack');

const PUBLIC_URL = process.env.PUBLIC_URL || '';

const STACK_CONFIG = process.env.CONFIG || 'default';

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

  // TODO(burdon): Config production path for apollo (diff webpack config).
  output: {
    path: `${__dirname}/dist/production`,
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
          // name: 'vendor',
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // return `vendor-${packageName.replace('@', '')}`;

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

    // https://www.npmjs.com/package/dotenv-webpack#properties
    new Dotenv({
      path: process.env.DOT_ENV || '.env'
    }),

    // NOTE: Must be defined below Dotenv (otherwise will override).
    // https://webpack.js.org/plugins/environment-plugin
    new webpack.EnvironmentPlugin({
      PUBLIC_URL: String(PUBLIC_URL),
      STACK_CONFIG: String(STACK_CONFIG),
      DEBUG: ''
    }),

    // Define the build config file based on the target.
    // https://webpack.js.org/plugins/normal-module-replacement-plugin
    new webpack.NormalModuleReplacementPlugin(/(.*)__STACK_CONFIG__/, (resource) => {
      resource.request = resource.request.replace(/__STACK_CONFIG__/, STACK_CONFIG);
    }),

    // https://www.npmjs.com/package/webpack-version-file-plugin
    new VersionFile({
      packageFile: path.join(__dirname, 'package.json'),
      outputFile: path.join(__dirname, 'version.json')
    }),
  ],

  module: {
    rules: [
      // js
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },

      // https://www.apollographql.com/docs/react/integrations/webpack/
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },

      // fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
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
