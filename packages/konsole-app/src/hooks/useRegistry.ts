//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import { createContext, useContext } from 'react';

import { IRegistryApi } from '@dxos/registry-api';

export const RegistryContext = createContext<IRegistryApi | undefined>(undefined);

// TODO(burdon): RegistryClient or RegistryAPI? (rename to former).
export const useRegistryClient = (): IRegistryApi => {
  const api = useContext(RegistryContext);
  assert(api);
  return api;
};
