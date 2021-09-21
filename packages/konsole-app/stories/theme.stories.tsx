//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';

import { Box, Button, CssBaseline, Paper, Toolbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { createCustomTheme, } from '../src';

import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'Theme'
};

// TODO(burdon): Themes not working inside storybooks?

// https://www.npmjs.com/package/storybook-addon-material-ui
// TODO(burdon): https://storybook.js.org/addons/@react-theming/storybook-addon

const App = () => (
  <Paper>
    <Toolbar>
      <Button variant='contained' color='primary'>Primary</Button>
      <Box sx={{ padding: 1 }} />
      <Button variant='outlined' color='secondary'>Secondary</Button>
    </Toolbar>
  </Paper>
);

export const Primary = () => {
  return (
    <RootContainer config={config}>
      <App />
    </RootContainer>
  );
};

export const Test = () => {
  return (
    <ThemeProvider theme={createCustomTheme(config)}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

export const Raw = () => {
  return (
    <App />
  );
};
