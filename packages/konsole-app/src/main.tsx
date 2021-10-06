//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import { RegistryInitializer } from '@dxos/react-registry-client';

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

  ReactDOM.render((
    <RegistryInitializer config={config}>
      <App
        config={config}
        panels={panels}
        theme={theme}
      />
    </RegistryInitializer>
  ), document.getElementById('root'));
};

void loadConfig().then(start);
