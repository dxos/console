//
// Copyright 2020 DXOS.org
//

import { createContext, useContext, useEffect, useState } from 'react';

export interface IRecordType {
  type: string
  label: string
}

// TODO(burdon): Protocol buffer definition?
export interface IRecord {
  cid: string
  type: string
  created: string
  name: string
  title: string
  url?: string
}

export interface IQuery {
  type?: string
}

export interface IRegistryClient {
  getRecordTypes: () => IRecordType[]
  queryRecords: (query?: IQuery) => IRecord[]
}

export const RegistryContext = createContext<IRegistryClient | undefined>(undefined);

export const useRegistry = (): IRegistryClient => {
  return useContext(RegistryContext)!;
};

export const useRecordTypes = (): IRecordType[] => {
  const registryClient = useRegistry();
  return registryClient.getRecordTypes();
};

export const useRecords = (query?: IQuery): [IRecord[], () => void] => {
  const registryClient = useRegistry();
  const [records, setRecords] = useState<IRecord[]>([]);

  useEffect(() => {
    setRecords(registryClient.queryRecords(query));
  }, [JSON.stringify(query)]); // Otherwise inf. loop.

  return [
    records,
    () => setRecords(registryClient.queryRecords(query)) // Refresh.
  ];
};
