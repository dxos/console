//
// Copyright 2020 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import { Container, IPanel, Root, Sidebar } from './containers';
import { ConfigContext, IConfig, RegistryContext } from './hooks';
import { ConfigPanel, RecordPanel } from './panels';
import { MockRegistryClient } from './testing';

// TODO(burdon): Load from environment.
const config: IConfig = {
  app: {
    name: 'Konsole',
    theme: 'dark'
  }
};

const panels: IPanel[] = [
  {
    label: 'Config',
    component: ConfigPanel
  },
  {
    label: 'Records',
    component: RecordPanel
  }
];

// TODO(burdon): Router: https://reactrouter.com/web/api/Hooks
const start = (config: IConfig) => {
  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={new MockRegistryClient()}>
        <Root>
          <Container
            sidebar={<Sidebar panels={panels} />}
          >
            <ConfigPanel />
          </Container>
        </Root>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  ), document.getElementById('root'));
};

start(config);
