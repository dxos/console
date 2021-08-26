//
// Copyright 2020 DXOS.org
//

import { createContext, useContext } from 'react';

import { IQuery, IRecord, IRecordType, IRegistryClient } from '../registry';

export const RegistryContext = createContext<IRegistryClient | undefined>(undefined);

export const useRegistryClient = (): IRegistryClient => {
  return useContext(RegistryContext)!;
};

export const useRecordTypes = (): IRecordType[] => {
  const registryClient = useRegistryClient();
  return registryClient.getRecordTypes();
};

export const useRecords = (query?: IQuery): IRecord[] => {
  const registryClient = useRegistryClient();
  return registryClient.queryRecords(query);
};
