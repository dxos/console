//
// Copyright 2021 DXOS.org
//

import { createContext, useContext, useEffect, useState } from 'react';

import { IQuery, IRecord, IRecordType, IRegistryClient } from '../registry';

export const RegistryContext = createContext<IRegistryClient | undefined>(undefined);

export const useRegistryClient = (): IRegistryClient => {
  return useContext(RegistryContext)!;
};