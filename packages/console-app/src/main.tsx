//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import { GraphQLClient, ClientContext } from 'graphql-hooks';
import React from 'react';
import ReactDOM from 'react-dom';

import { RegistryInitializer } from '@dxos/react-registry-client';

import { App } from './apps';
import { loadConfig } from './config';
import { panels } from './panels';
import { createCustomTheme } from './theme';

/**
 * React app bootstrap (providers and top-level routes).
 */
void (async () => {
  const config = await loadConfig();

  debug.enable(config.runtime?.system?.debug!);
  const log = debug('dxos:console:main');
  log('Starting...', { config });

  const signalClient = new GraphQLClient({
    url: config.runtime?.services?.signal?.api!
  });

  const theme = createCustomTheme(config);

  ReactDOM.render((
    <RegistryInitializer config={config.runtime!.services as any}>
      <ClientContext.Provider value={signalClient}>
        <App
          config={config}
          panels={panels}
          theme={theme}
        />
      </ClientContext.Provider>
    </RegistryInitializer>
  ), document.getElementById('root'));
})();
