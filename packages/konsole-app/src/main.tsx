//
// Copyright 2020 DXOS.org
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
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

import { Container, Sidebar } from './containers';
import { ConfigContext, IConfig, RegistryContext } from './hooks';
import { panels } from './panels';
import { MockRegistryClient } from './testing';

const log = debug('dxos:console');
debug.enable('dxos:*');

// TODO(burdon): Load from environment.
const config: IConfig = {
  app: {
    name: 'DXOS KONSOLE',
    theme: 'dark'
  }
};

// TODO(burdon): Factor out.
const createCustomTheme = (config: IConfig) => createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          overflow: 'hidden' // Prevent bounce.
        },
      },
    },
  },
  palette: {
    type: config.app.theme
  },
  props: {
    MuiAppBar: {
      elevation: 0
    },
    MuiButtonBase: {
      disableRipple: true
    }
  },
});

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
  log('Starting...');

  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={new MockRegistryClient()}>
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

start(config);
