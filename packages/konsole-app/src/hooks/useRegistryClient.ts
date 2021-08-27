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
    const fetchRecordTypes = async () => {
      setData(await registryClient.getRecordTypes());
    };
    fetchRecordTypes();
  });

  return data;
};

export const useRecords = (query?: IQuery): IRecord[] => {
  const registryClient = useRegistryClient();
  const [data, setData] = useState<IRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      setData(await registryClient.queryRecords(query));
    };
    fetchRecords();
  });

  return data;
};
