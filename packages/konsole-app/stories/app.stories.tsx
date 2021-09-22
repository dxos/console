//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';
import { MemoryRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import StoryRouter from 'storybook-react-router';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { MockRegistryApi } from '@dxos/registry-api';

import {
  createCustomTheme,
  panels,
  ConfigContext,
  RegistryContext,
} from '../src';

// TODO(burdon): Move/rename.
import { Main } from '../src/App';

import { config } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'App',
  decorators: [
    StoryRouter()
  ]
};

export const Primary = () => {
  // TODO(burdon): Theme doesn't work in storybook.
  const theme = createCustomTheme(config);

  return (
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={MockRegistryApi}>
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
