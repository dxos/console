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

export const resolvers = {
  Query: {
    //
    // Status
    //
    status: () => ({
      timestamp: new Date().toUTCString(),
      version
    }),

    //
    // IPFS
    // TODO(burdon): Call from client?
    // https://github.com/ipfs/js-ipfs
    // https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#api
    //
    ipfs: async () => {
      log('Calling IPFS...');

      // TODO(burdon): Config.
      const ipfs = new IpfsHttpClient('/ip4/127.0.0.1/tcp/5001');

      const version = await ipfs.version();
      const status = await ipfs.id();

      return {
        json: JSON.stringify({
          version,
          status
        })
      };
    }
  }
};
