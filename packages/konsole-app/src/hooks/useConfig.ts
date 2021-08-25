//
// Copyright 2020 DXOS.org
//

import { createContext, useContext } from 'react';

export interface IConfig {
  app: {
    name: string
    theme: 'light' | 'dark' | undefined
  }
}

export const ConfigContext = createContext({});

export const useConfig = () => {
  return useContext(ConfigContext) as IConfig;
};
