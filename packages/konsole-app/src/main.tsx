//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import { ApiFactory } from '@dxos/registry-api';

import { App } from './apps';
import { loadConfig } from './config';
import { IConfig } from './hooks';
import { panels } from './panels';
import { createCustomTheme } from './theme';

/**
 * React app bootstrap (providers and top-level routes).
 */
const start = async (config: IConfig) => {
  debug.enable(config.system.debug);
  const log = debug('dxos:console:main');
  log('Starting...', { config });

  const theme = createCustomTheme(config);
  const registryApi = await ApiFactory.createRegistryApi(config.services.dxns.server);

  ReactDOM.render((
    <App
      config={config}
      registryApi={registryApi}
      panels={panels}
      theme={theme}
    />
  ), document.getElementById('root'));
};

void loadConfig().then(start);
