//
// Copyright 2020 DXOS.org
//

import { createContext, useContext } from 'react';

export interface IConfig {
  app: {
    name: string
    theme?: 'light' | 'dark' | undefined
  },
  registry: {
    endpoint: string
  }
}

// TODO(marcin) -> load config as in Console2
export const ConfigContext = createContext<IConfig | undefined>(undefined);

export const useConfig = (): IConfig => {
  return useContext(ConfigContext)!;
};
