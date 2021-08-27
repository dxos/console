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

import { loadConfig, ConfigContext, IConfig, RegistryContext } from './hooks';
import { RegistryClient } from './registry/RegistryClient';
import { Container, Root, Sidebar } from './containers';
import { panels } from './panels';

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

const start = (config: IConfig) => {
  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={new RegistryClient(config)}>
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

loadConfig().then(start);
