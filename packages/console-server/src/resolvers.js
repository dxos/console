//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { version } from '../package.json';

const log = debug('dxos:console:resolver');

//
// Resolver
//

export const resolvers = {
  Query: {
    status: () => ({
      version
    })
  }
};
