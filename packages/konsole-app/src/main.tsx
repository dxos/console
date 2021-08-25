//
// Copyright 2020 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import { App, Root } from './components';
import { ConfigContext } from './hooks';

// TODO(burdon): Load from environment.
const config = {
  app: {
    name: 'Konsole',
    theme: 'dark'
  }
};

const start = (config: {}) => {
  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <Root>
        <App />
      </Root>
    </ConfigContext.Provider>
  ), document.getElementById('root'));
};

start(config);
