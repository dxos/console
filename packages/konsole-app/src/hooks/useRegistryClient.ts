//
// Copyright 2020 DXOS.org
//

import { createContext, useContext, useEffect, useState } from 'react';

import { IQuery, IRecord, IRecordType, IRegistryClient } from '../registry';

export const RegistryContext = createContext<IRegistryClient | undefined>(undefined);

export const useRegistryClient = (): IRegistryClient => {
  return useContext(RegistryContext)!;
};

export const useRecordTypes = (): IRecordType[] => {
  const registryClient = useRegistryClient();
  const [data, setData] = useState<IRecordType[]>([]);

  useEffect(() => {
    if ((registryClient as any).state.apiState !== 'ready') {
      console.log('non-ready');
      return;
    }

    console.log('ready');
    const fetchRecordTypes = async () => {
      setData(await registryClient.getRecordTypes());
    };
    fetchRecordTypes();
    console.log('fetched types' + data.length);
  }, [(registryClient as any).state.apiState]);

  console.log('returning types' + data.length);
  return data;
};

export const useRecords = (query?: IQuery): IRecord[] => {
  const registryClient = useRegistryClient();
  const [data, setData] = useState<IRecord[]>([]);

  useEffect(() => {
    console.log('query type: ' + query?.type);
    const fetchRecords = async () => {
      setData(await registryClient.queryRecords(query));
    };
    fetchRecords();
    console.log('fetched records' + data.length);
  }, [query?.type]);

  console.log('returning records' + data.length);
  return data;
};
