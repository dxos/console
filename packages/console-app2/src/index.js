//
// Copyright 2021 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import App from './main';
import { loadConfig } from './config';

loadConfig().then(config => {
  ReactDOM.render(<App config={config.values} />, document.querySelector('#root'));
});
