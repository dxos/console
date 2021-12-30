//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import { createContext, useContext } from 'react';

import { ConfigV1Object } from '@dxos/config';

export const ConfigContext = createContext<ConfigV1Object | undefined>(undefined);

export const useConfig = (): ConfigV1Object => {
  const config = useContext(ConfigContext)!;
  assert(config);
  return config;
};
