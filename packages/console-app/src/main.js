//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React from 'react';
import { render } from 'react-dom';

import config from './config';

import Main from './containers/Main';

debug.enable(config.system.debug);

render(<Main config={config} />, document.getElementById('root'));
