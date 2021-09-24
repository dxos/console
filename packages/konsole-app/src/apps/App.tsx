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

import { Container, Sidebar } from '../components';
import { IConfig, ConfigContext, RegistryContext } from '../hooks';
import { IPanel } from '../types';

interface MainProps {
  panels: IPanel[];
}

/**
 * Main app container.
 */
export const Main = ({ panels }: MainProps) => {
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
        {/* TODO(burdon): Cache panels so that they are not rendered each time. */}
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
  registryApi: IRegistryApi
  panels: IPanel[]
  theme: Theme
}

export const App = ({ config, registryApi, panels, theme }: AppProps) => (
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