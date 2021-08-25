//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { App, ConfigContext, IConfig } from '../src';

export default {
  title: 'App'
};

export const withApp = () => {
  const config: IConfig = {
    app: {
      name: 'Test'
    }
  };

  return (
    <ConfigContext.Provider value={config}>
      <App />
    </ConfigContext.Provider>
  );
};
