//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

import { useSubstrate } from '../substrate-lib';

export function useBlockNumber () {
  const { api } = useSubstrate();
  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    const unsubPromise = api.derive.chain.bestNumberFinalized((result) => setBlockNumber(result.toNumber()));
    const result: () => any = async () => {
      try {
        const unsub = await unsubPromise;
        unsub();
      } catch (e) {
        console.error(e);
      }
    };
    return result;
  }, [api]);

  return blockNumber;
}
