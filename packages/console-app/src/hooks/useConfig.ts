//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import { createContext, useContext } from 'react';

// TODO(burdon): Define JSON Schema for config file.
export interface IConfig {
  app: {
    title: string
    theme?: 'light' | 'dark' | undefined,
    pollingPeriod?: 5000
  },
  build: {
    version: string
  },
  registry: {
    endpoint: string
  },
  services: {
    kube: {
      endpoints: {
        logs: string,
        services: string
      }
    }
    dxns: {
      server: string
    },
    app: {
      server: string,
      prefix: string
    },
    ipfs: {
      gateway: string,
      server: string
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
