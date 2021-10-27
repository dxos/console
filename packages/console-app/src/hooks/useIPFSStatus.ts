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
      console.log({ config });
      const ipfs = create({ url: 'https://enterprise.kube.dxos.network/dxos/ipfs' });

      const id = await ipfs.id();
      const version = await ipfs.version();
      const peers = await ipfs.swarm.peers();
      const stats = await ipfs.stats.repo();

      const refs: string[] = [];

      for await (const ref of ipfs.refs.local()) {
        if (!ref.err) {
          refs.push(ref.ref);
        }
      }

      setStatus({
        id,
        version,
        repo: {
          stats
        },
        refs: {
          local: refs
        },
        swarm: {
          peers
        }
      });
    })();
  }, []);

  return status;
};
