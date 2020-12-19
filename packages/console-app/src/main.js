//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React from 'react';
import { render } from 'react-dom';

import config from './config';

import Main from './containers/Main';

debug.enable(config.system.debug);

// https://webpack.js.org/guides/progressive-web-application
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const path = decodeURIComponent(window.location.pathname) + 'service-worker.js';
    navigator.serviceWorker.register(path).then(registration => {
      console.log('SW registered:', registration);
    }).catch(err => {
      console.warn('SW registration failed:', err);
    });
  });
}

render(<Main config={config} />, document.getElementById('root'));
