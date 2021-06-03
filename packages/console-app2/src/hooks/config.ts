//
// Copyright 2020 DXOS.org
//

import { createContext, useContext } from 'react';

export const configContext = createContext<any>(undefined);

export function useConfig () {
  const context = useContext(configContext);
  if (context === undefined) {
    throw new Error('Config context is used outside of its provider.');
  }
  return context;
}
