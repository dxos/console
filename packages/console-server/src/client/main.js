//
// Copyright 2020 DxOS.org
//

import debug from 'debug';
import React from 'react';
import { render } from 'react-dom';

import { Main } from '@dxos/console-client';

// Load from global printed into HTML page via template.
const { config } = window.__DXOS__;

debug.enable(config.system.debug);

render(<Main config={config} />, document.getElementById('root'));
