//
// Copyright 2021 DXOS.org
//

import { create } from 'ipfs-http-client';
import { useEffect, useState } from 'react';

import { useConfig } from './useConfig';

export const useIFPSStatus = () => {
  const [status, setStatus] = useState<any>();
  const config = useConfig();

  useEffect(() => {
    void (async () => {
      // NOTE: Hangs if server not running.
      const ipfs = create({ url: config.get('runtime.services.ipfs.server') });

      const id = await ipfs.id();
      const version = await ipfs.version();
      const peers = await ipfs.swarm.peers();
      const stats = await ipfs.stats.repo();

      let statusObject: any = {
        id,
        version,
        repo: {
          stats
        },
        swarm: {
          peers
        }
      };

      // https://github.com/GoogleChromeLabs/jsbi/issues/30
      statusObject = JSON.parse(JSON.stringify(statusObject, (_key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value
      ));

      setStatus(statusObject);
    })();
  }, []);

  return status;
};
