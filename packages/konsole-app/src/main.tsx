//
// Copyright 2020 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams
} from 'react-router-dom';

import { Config } from '@dxos/config';

import { Container, Root, Sidebar } from './containers';
import { ConfigContext, IConfig, RegistryContext } from './hooks';
import { panels } from './panels';
import { RegistryClient } from './registry/RegistryClient';

// TODO(burdon): Load from environment.
const config: IConfig = {
  app: {
    name: 'Konsole',
    theme: 'dark'
  }
};

const App = () => {
  const history = useHistory();
  const { panel }: { panel: string } = useParams();

  return (
    <Root>
      <Container
        sidebar={
          <Sidebar
            panels={panels}
            selected={`/${panel}`}
            onSelect={path => history.push(path)}
          />
        }
      >
        <>
          {panels.map(({ path, component }) => (
            <Route
              key={path}
              path={path}
              component={component}
            />
          ))}
        </>
      </Container>
    </Root>
  )
};

const start = (config: IConfig, substrateConfig: Config) => {
  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={new RegistryClient(config, substrateConfig)}>
        <Router>
          <Switch>
            <Route path='/:panel'>
              <App />
            </Route>
            <Redirect to={panels[0].path} />
          </Switch>
        </Router>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  ), document.getElementById('root'));
};

start(config, {} as any);
