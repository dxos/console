//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import { BotFactoryClientProvider, ClientProvider } from '@dxos/react-client';
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

  debug.enable(config.get('runtime.system.debug') ?? '');
  const log = debug('dxos:console:main');
  log('Starting...', { config });

  const theme = createCustomTheme(config);

  ReactDOM.render((
    <ClientProvider config={config}>
      <BotFactoryClientProvider>
        <RegistryInitializer config={config}>
          <App
            config={config}
            panels={panels}
            theme={theme}
          />
        </RegistryInitializer>
      </BotFactoryClientProvider>
    </ClientProvider>
  ), document.getElementById('root'));
})();
