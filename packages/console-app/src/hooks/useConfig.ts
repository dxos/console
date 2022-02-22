//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import { createContext, useContext } from 'react';

import { Config } from '@dxos/config';

export const ConfigContext = createContext<Config | undefined>(undefined);

export const useConfig = (): Config => {
  const config = useContext(ConfigContext)!;
  assert(config);
  return config;
};
