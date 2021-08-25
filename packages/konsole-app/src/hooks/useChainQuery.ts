//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { useBlockNumber } from './useBlockNumber';

export function useChainQuery<T> (
  query: () => Promise<T>,
  deps: React.DependencyList
): [unknown | undefined, T | undefined] {
  const blockNumer = useBlockNumber();

  const [fetching, setFetching] = useState(false);
  const [queriedData, setQueriedData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>(undefined);

  useEffect(() => {
    if (fetching || !query) {
      return;
    }
    setFetching(true);

    const fetchData = async () => {
      try {
        setQueriedData(await query());
      } catch (e) {
        setError(e);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [blockNumer, ...deps]);

  return [error, queriedData];
}
