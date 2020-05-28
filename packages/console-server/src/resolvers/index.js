//
// Copyright 2020 DxOS.org
//

import debug from 'debug';
import defaultsDeep from 'lodash.defaultsdeep';

import { ipfsResolvers } from './ipfs';
import { systemResolvers } from './system';

const log = debug('dxos:console:server:resolvers');

/**
 * Resolvers
 * https://www.apollographql.com/docs/graphql-tools/resolvers
 */
export const resolvers = defaultsDeep({

  // TODO(burdon): Auth.
  // https://www.apollographql.com/docs/apollo-server/data/errors/#codes

  Mutation: {
    action: async (_, { command }) => {
      log(`WNS action: ${command}`);

      return {
        timestamp: new Date().toUTCString(),
        code: 0
      };
    }
  }
}, ipfsResolvers, systemResolvers);
