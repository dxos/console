//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
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

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { loadSubstrateConfig } from './config';
import { Container, Sidebar } from './containers';
import { ConfigContext, IConfig, RegistryContext } from './hooks';
import { panels } from './panels';
import { createCustomTheme } from './theme';

import { RegistryClient } from './registry/RegistryClient';

/**
 * Main app container.
 * @constructor
 */
const Main = () => {
  const history = useHistory();
  const { panel }: { panel: string } = useParams();

  return (
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
  )
};

/**
 * React app bootstrap (providers and top-level routes).
 * @param config
 */
const start = (config: IConfig) => {
  const log = debug('dxos:console:main');
  log('Starting...');
  debug.enable(config.system.debug);

  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={new RegistryClient(config)}>
        <MuiThemeProvider theme={createCustomTheme(config)}>
          <CssBaseline />
          <Router>
            <Switch>
              <Route path='/:panel'>
                <Main />
              </Route>
              <Redirect to={panels[0].path} />
            </Switch>
          </Router>
        </MuiThemeProvider>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  ), document.getElementById('root'));
};

loadSubstrateConfig().then(start);
