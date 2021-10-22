//
// Copyright 2018 DxOS
//


const path = require('path');
const toPath = (filePath) => path.join(process.cwd(), filePath);

module.exports = {
  stories: ['../stories/**/*.stories.tsx'],

  // TODO(burdon): Storybook patch.
  // https://mui.com/guides/migration-v4/#heading-storybook-emotion-with-v5
  // https://github.com/mui-org/material-ui/issues/24282#issuecomment-796755133
  /*
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': toPath('node_modules/@emotion/react'),
          'emotion-theming': toPath('node_modules/@emotion/react'),
        }
      }
    };
  }
  */
};
