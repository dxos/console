//
// Copyright 2020 DxOS.org
//

import debug from 'debug';
import IpfsHttpClient from 'ipfs-http-client';

const log = debug('dxos:console:server:resolvers');

const timestamp = () => new Date().toUTCString();

/**
 * Resolvers
 * https://www.apollographql.com/docs/graphql-tools/resolvers
 * @param config
 */
export const createResolvers = config => ({

  // TODO(burdon): Auth mutations.
  // https://www.apollographql.com/docs/apollo-server/data/errors/#codes

  Mutation: {
    //
    // WNS
    //

    wns_action: async (_, { command }) => {
      log(`WNS action: ${command}`);

      return {
        timestamp: timestamp(),
        code: 0
      };
    }
  },

  Query: {
    //
    // System
    //

    // TODO(burdon): System calls.
    system_status: () => {
      return {
        timestamp: timestamp(),
        json: JSON.stringify({
          dxos: {
            image: '0.0.1'
          }
        })
      };
    },

    //
    // IPFS
    // TODO(burdon): Call from client?
    // https://github.com/ipfs/js-ipfs
    // https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#api
    //

    ipfs_status: async () => {
      log('Calling IPFS...');

      // TODO(burdon): Config.
      // NOTE: Hangs if server not running.
      const ipfs = new IpfsHttpClient('/ip4/127.0.0.1/tcp/5001');

      const version = await ipfs.version();
      const status = await ipfs.id();

      console.log(version);
      log('Done');

      return {
        json: JSON.stringify({
          version,
          status
        })
      };
    }
  }
});
