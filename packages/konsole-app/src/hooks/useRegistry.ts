//
// Copyright 2021 DXOS.org
//

import { createContext, useContext } from 'react';

import { IDxnsApi } from '@dxos/registry-api';

export const RegistryContext = createContext<IDxnsApi | undefined>(undefined);

export const useRegistryClient = (): IDxnsApi => {
  const api = useContext(RegistryContext);
  if (!api) {
    throw new Error('DxnsApi not provided');
  }
  return api;
};
