//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

import { IQuery, RegistryTypeRecord } from '@dxos/registry-api';

import { useRegistryClient } from './useRegistry';

export function useRecordTypes (query?: IQuery): RegistryTypeRecord[] | undefined {
  const [resources, setRegistryTypeRecords] = useState<RegistryTypeRecord[] | undefined>(undefined);
  const registryClient = useRegistryClient();

  useEffect(() => {
    setImmediate(async () => {
      const recordTypes = await registryClient.getTypes(query);
      setRegistryTypeRecords(recordTypes);
    })
  }, [query]);

  return resources;
}
