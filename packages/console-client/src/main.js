//
// Copyright 2020 DxOS
//

import debug from 'debug';
import React from 'react';
import { render } from 'react-dom';

import Main from './containers/Main';

debug.enable('dxos:console:client:*');

render(<Main />, document.getElementById('root'));
