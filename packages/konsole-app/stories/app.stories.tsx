//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { IConfig, RecordPanel, ConfigContext, RegistryContext } from '../src';
import { MockRegistryClient } from '../src/testing';

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
      <RegistryContext.Provider value={new MockRegistryClient()}>
        <RecordPanel />
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  );
};
