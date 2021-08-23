//
// Copyright 2021 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import { loadConfig } from './config';
import App from './main';

loadConfig().then(config => {
  ReactDOM.render(<App config={config.values} />, document.querySelector('#root'));
});
