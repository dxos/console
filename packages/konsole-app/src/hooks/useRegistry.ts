//
// Copyright 2021 DXOS.org
//

import { createContext, useContext } from 'react';

import { IRegistryApi } from '@dxos/registry-api';

export const RegistryContext = createContext<IRegistryApi | undefined>(undefined);

export const useRegistryClient = (): IRegistryApi => {
  const api = useContext(RegistryContext);
  if (!api) {
    throw new Error('DxnsApi not provided');
  }
  return api;
};
