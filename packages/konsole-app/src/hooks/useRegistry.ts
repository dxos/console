//
// Copyright 2020 DXOS.org
//

import { createContext, useContext } from 'react';

export interface IRecordType {
  type: string
  label: string
}

// TODO(burdon): Protocol buffer definition?
export interface IRecord {
  cid: string
  name: string
  type: string
  title: string
}

export interface IQuery {
  type?: string
}

export interface IRegistryClient {
  getRecordTypes: () => IRecordType[]
  queryRecords: (query?: IQuery) => IRecord[];
}

export const RegistryContext = createContext<IRegistryClient | undefined>(undefined);

export const useRegistry = (): IRegistryClient => {
  return useContext(RegistryContext)!;
};

export const useRecordTypes = (): IRecordType[] => {
  const registryClient = useRegistry();
  return registryClient.getRecordTypes();
};

export const useRecords = (query?: IQuery): IRecord[] => {
  const registryClient = useRegistry();
  return registryClient.queryRecords(query);
};
