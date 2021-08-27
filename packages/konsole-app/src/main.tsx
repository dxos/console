//
// Copyright 2020 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import { App, Root } from './components';
import { ConfigContext, IConfig, RegistryContext } from './hooks';
import { RegistryClient } from './registry/RegistryClient';

// TODO(burdon): Load from environment.
const config: IConfig = {
  app: {
    name: 'Konsole',
    theme: 'dark'
  },
  registry: {
    endpoint: 'wss://dxns1.kube.moon.dxos.network/dxns/ws'
  }
};

const start = (config: IConfig) => {
  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={new RegistryClient({ endpoint: config.registry.endpoint })}>
        <Root>
          <App />
        </Root>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  ), document.getElementById('root'));
};

start(config);
