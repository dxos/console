//
// Copyright 2021 DXOS.org
//

import { IDxnsApi } from '@dxos/registry-api';
import { createContext, useContext, useEffect, useState } from 'react';

import { IQuery, IRecord, IRecordType, IRegistryClient } from '../registry';

export const RegistryContext = createContext<IDxnsApi | undefined>(undefined);

export const useRegistryClient = (): IDxnsApi => {
  const api = useContext(RegistryContext);
  if(!api) {
    throw new Error('DxnsApi not provided')
  }
  return api;
};