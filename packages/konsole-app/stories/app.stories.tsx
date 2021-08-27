//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { IConfig, RecordPanel, ConfigContext, RegistryContext } from '../src';
import { MockRegistryClient } from '../src/testing';

// TODO(burdon): Module not found: Error: [CaseSensitivePathsPlugin]
// https://github.com/storybookjs/storybook/issues/7704

export default {
  title: 'App'
};

export const Primary = () => {
  const config: IConfig = {
    app: {
      name: 'Test',
      theme: "light"
    },
    registry: {
      endpoint: ''
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
