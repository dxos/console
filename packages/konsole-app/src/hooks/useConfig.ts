//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import { createContext, useContext } from 'react';

// TODO(burdon): Define JSON Schema for config file.
export interface IConfig {
  app: {
    title: string
    theme?: 'light' | 'dark' | undefined
  },
  registry: {
    endpoint: string
  },
  services: {
    dxns: {
      server: string
    },
    app: {
      server: string,
      prefix: string
    }
  },
  system: {
    debug: string
  }
}

export const ConfigContext = createContext<IConfig | undefined>(undefined);

export const useConfig = (): IConfig => {
  const config = useContext(ConfigContext)!;
  assert(config);
  return config;
};
