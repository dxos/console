//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import { Config } from '@dxos/config';

import { Debug } from './apps';
import { loadConfig } from './config';
import { createCustomTheme } from './theme';

const start = async (config: Config) => {
  debug.enable(config.get('runtime.system.debug') ?? '');
  const log = debug('dxos:console:main');
  log('Starting...', { config });

  const theme = createCustomTheme(config);

  ReactDOM.render((
    <Debug
      config={config}
      theme={theme}
    />
  ), document.getElementById('root'));
};

void loadConfig().then(start);
