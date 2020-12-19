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
    // TODO(burdon): Remove "wrn:" from path so that escape characters are not required.
    // main.js?56d7:23 SW registration failed: TypeError: Failed to register a ServiceWorker:
    // The provided scope ('https://apollo1.kube.moon.dxos.network/app/wrn%3A%2F%2Fdxos%2Fapplication%2Fconsole%40alpha/')
    // or scriptURL ('https://apollo1.kube.moon.dxos.network/app/wrn%3A%2F%2Fdxos%2Fapplication%2Fconsole%40alpha/service_worker.js')
    // includes a disallowed escape character.
    //     at eval (main.js?56d7:20)
    const path = window.location.pathname + 'service_worker.js';
    navigator.serviceWorker.register(path).then(registration => {
      console.log('SW registered:', registration);
    }).catch(err => {
      console.warn('SW registration failed:', err);
    });
  });
}

render(<Main config={config} />, document.getElementById('root'));
