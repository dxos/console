//
// Copyright 2021 DXOS.org
//

const path = require('path');

// const toPath = (filePath) => path.join(process.cwd(), filePath);

module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-material-ui'
  ],

  // https://storybook.js.org/docs/react/configure/typescript
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  },

  // TODO(burdon): Mui 5 workaround (pending storybook version 7).
  // https://mui.com/guides/migration-v4/#heading-storybook-emotion-with-v5
  // https://github.com/mui-org/material-ui/issues/24282#issuecomment-796755133
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': require.resolve('@emotion/react'),
          "@emotion/styled": require.resolve('@emotion/styled'),
          'emotion-theming': require.resolve('@emotion/react')
        }
      }
    };
  }
}
