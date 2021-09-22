//
// Copyright 2021 DXOS.org
//

import React from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams
} from 'react-router-dom';

import { CssBaseline, Theme, ThemeProvider } from '@mui/material';

import { IRegistryApi } from '@dxos/registry-api';

import { Container, Sidebar } from './components';
import { IConfig, ConfigContext, RegistryContext } from './hooks';
import { IPanel } from './types';

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
  theme: Theme
  panels: IPanel[]
  registryApi: IRegistryApi
}

/**
 * App root configuring providers.
 */
// TODO(burdon): Pass in router.
// TODO(burdon): Cache panels so that they are not rendered each time.
export const App = ({ config, theme, panels, registryApi }: AppProps) => {
  return (
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={registryApi}>
        <ThemeProvider theme={theme}>
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
