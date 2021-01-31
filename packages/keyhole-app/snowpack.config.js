//
// Copyright 2020 DXOS.org
//

// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import('snowpack').SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/dist'
  },
  plugins: [
    '@snowpack/plugin-typescript'
  ],
  packageOptions: {
    installTypes: true,
    polyfillNode: true
  },
  devOptions: {
  },
  buildOptions: {
  }
};
