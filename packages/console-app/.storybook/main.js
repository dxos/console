//
// Copyright 2018 DxOS
//

const path = require('path');
const toPath = (filePath) => path.join(process.cwd(), filePath);

module.exports = {
  stories: ['../stories/**/*.stories.tsx'],

  webpackFinal: async config => {

    // https://mui.com/guides/migration-v4/
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': toPath('node_modules/@emotion/react'),
          'emotion-theming': toPath('node_modules/@emotion/react')
        }
      }
    };
  }
};
