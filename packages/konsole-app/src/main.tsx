//
// Copyright 2020 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import { Config } from '@dxos/config';

import { App, Root } from './components';
import { ConfigContext, IConfig, RegistryContext } from './hooks';
import { RegistryClient } from './registry/RegistryClient';
import { loadConfig } from './config';

// TODO(burdon): Load from environment.
const config: IConfig = {
  app: {
    name: 'Konsole',
    theme: 'dark'
  }
};

const start = (config: IConfig, substrateConfig: Config) => {
  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={new RegistryClient(config, substrateConfig)}>
        <Root>
          <App />
        </Root>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  ), document.getElementById('root'));
};

loadConfig().then(substrateConfig =>
  start(config, substrateConfig));
