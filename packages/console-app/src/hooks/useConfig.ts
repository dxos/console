//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import { createContext, useContext } from 'react';

import { ConfigObject } from '@dxos/config';

export const ConfigContext = createContext<ConfigObject | undefined>(undefined);

export const useConfig = (): ConfigObject => {
  const config = useContext(ConfigContext)!;
  assert(config);
  return config;
};
