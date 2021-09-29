//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

import { IQuery } from '@dxos/registry-api';

import { IRecordType } from '../types';
import { useRegistryClient } from './useRegistry';

export const useRecordTypes = (query?: IQuery): IRecordType[] => {
  const [recordTypes, setRecordTypes] = useState<IRecordType[]>([]);
  const registryClient = useRegistryClient();

  useEffect(() => {
    setImmediate(async () => {
      const recordTypes = await registryClient.getTypes(query);

      // TODO(burdon): Reconsile types (use registry type).
      setRecordTypes(recordTypes.map(record => ({
        // TODO(burdon): Normalize with other fields that return strings.
        type: record.cid,
        label: record.messageName
      })));
    });
  }, [query]);

  return recordTypes;
};
