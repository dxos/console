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

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/styles';

import { ApiFactory } from '@dxos/registry-api';

import { Container, Sidebar } from './components';
import { loadSubstrateConfig } from './config';
import { ConfigContext, IConfig, RegistryContext } from './hooks';
import { panels } from './panels';
import { createCustomTheme } from './theme';

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
  );
};

/**
 * React app bootstrap (providers and top-level routes).
 * @param config
 */
const start = async (config: IConfig) => {
  const log = debug('dxos:console:main');
  debug.enable(config.system.debug);

  log('Starting...', { config });
  const registryApi = await ApiFactory.createRegistryApi(config.services.dxns.server);

  // TODO(burdon): Cache panels so that they don't need to render each time.
  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={registryApi}>
        <ThemeProvider theme={createCustomTheme(config)}>
          <CssBaseline />
          <Router>
            <Switch>
              <Route path='/:panel'>
                <Main />
              </Route>
              <Redirect to={panels[0].path} />
            </Switch>
          </Router>
        </ThemeProvider>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  ), document.getElementById('root'));
};

void loadSubstrateConfig().then(start);
