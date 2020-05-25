//
// Copyright 2020 DxOS
//

import debug from 'debug';
import IpfsHttpClient from 'ipfs-http-client';

import { version } from '../package.json';

const log = debug('dxos:console:server:resolvers');

//
// Resolvers
//

const timestamp = () => new Date().toUTCString();

export const createResolvers = config => ({
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

    system_status: () => ({
      timestamp: timestamp(),
      version
    }),

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
