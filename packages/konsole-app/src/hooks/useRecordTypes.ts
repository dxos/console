//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

import { IQuery, RegistryTypeRecord } from '@dxos/registry-api';

import { IRecordType } from '../types';
import { useRegistryClient } from './useRegistry';

// TODO(burdon): Remove and reconcile RegistryTypeRecord, IRecordType.
export const mapRecordTypes = (records: RegistryTypeRecord[]): IRecordType[] => {
  return records.map(apiRecord => ({
    type: apiRecord.cid,
    label: apiRecord.messageName
  }));
};

export const useRecordTypes = (query?: IQuery): RegistryTypeRecord[] => {
  const [resources, setRegistryTypeRecords] = useState<RegistryTypeRecord[]>([]);
  const registryClient = useRegistryClient();

  useEffect(() => {
    setImmediate(async () => {
      const recordTypes = await registryClient.getTypes(query);
      setRegistryTypeRecords(recordTypes);
    });
  }, [query]);

  return resources;
};
