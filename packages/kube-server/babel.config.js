//
// Copyright 2020 DXOS.org
//

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [
    [
      'babel-plugin-inline-import', {
        extensions: [
          '.graphql',
          '.yml'
        ]
      }
    ],

    // Allows export of components importing GQL files (without webpack).
    'import-graphql',
    'inline-json-import',

    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-runtime'
  ]
};
