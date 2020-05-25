//
// Copyright 2020 DxOS.org
//

module.exports = {
  presets: [
    [
      '@babel/preset-env'
    ]
  ],
  plugins: [
    [
      'babel-plugin-inline-import', {
        extensions: [
          '.graphql',
          '.proto',
          '.txt'
        ]
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from'
  ]
};
