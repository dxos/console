//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import { ApiFactory } from '@dxos/registry-api';

import { loadConfig } from './config';
import { ConfigContext, IConfig, RegistryContext } from './hooks';
import { createCustomTheme } from './theme';
import { panels } from './panels';
// import { App } from './app';
import { IPanel } from './types';
import { HashRouter as Router, Redirect, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { Container, Sidebar } from './components';
import { CssBaseline, Theme, ThemeProvider } from '@mui/material';

import { IRegistryApi } from '@dxos/registry-api';

/**
 * Main Layout.
 */
export const Main = ({ panels }: { panels: IPanel[] }) => {
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

interface AppProps {
  config: IConfig
  panels: IPanel[]
  registryApi: IRegistryApi
}

/**
 * App root configuring providers.
 */
// TODO(burdon): Pass in router.
// TODO(burdon): Cache panels so that they are not rendered each time.
export const App = ({ config, panels, registryApi }: AppProps) => {
  return (
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={registryApi}>
        <ThemeProvider theme={createCustomTheme(config)}>
          <CssBaseline />
          <Router>
            <Switch>
              <Route path='/:panel'>
                <Main panels={panels} />
              </Route>
              <Redirect to={panels[0].path} />
            </Switch>
          </Router>
        </ThemeProvider>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  );
};

/**
 * React app bootstrap (providers and top-level routes).
 */
const start = async (config: IConfig) => {
  debug.enable(config.system.debug);
  const log = debug('dxos:console:main');
  log('Starting...', { config });

  // const theme = createCustomTheme(config);
  // theme={theme}
  const registryApi = await ApiFactory.createRegistryApi(config.services.dxns.server);

  ReactDOM.render((
    <App
      config={config}
      panels={panels}
      registryApi={registryApi}
    />
  ), document.getElementById('root'));
};

void loadConfig().then(start);
