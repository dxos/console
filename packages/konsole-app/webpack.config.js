//
// Copyright 2021 DXOS.org
//

const { merge } = require('webpack-merge');

const commonConfig = require('./webpack-common.config');

module.exports = merge(commonConfig, {
  entry: './src/main.tsx'
});
