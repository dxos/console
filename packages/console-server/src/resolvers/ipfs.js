//
// Copyright 2020 DxOS.org
//

import debug from 'debug';
import IpfsHttpClient from 'ipfs-http-client';
const log = debug('dxos:console:server:resolvers');

export const ipfsResolvers = {
  Query: {
    //
    // IPFS
    // TODO(burdon): Call from client?
    // https://github.com/ipfs/js-ipfs
    // https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#api
    //

    ipfs_status: async (_, __, { config }) => {
      log('Calling IPFS...');

      // NOTE: Hangs if server not running.
      const ipfs = new IpfsHttpClient(config.services.ipfs.server);

      const version = await ipfs.version();
      const status = await ipfs.id();

      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify({
          version,
          status
        })
      };
    }
  }
};
