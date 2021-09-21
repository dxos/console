//
// Copyright 2021 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import { Box, Button, CssBaseline, Paper, Toolbar, AppBar } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';

import { IConfig } from './hooks';
import { loadConfig } from './config';
import { createCustomTheme } from './theme';
import { DXOS as DXOSIcon } from './icons';

const AppBarOffset = styled('div')(({ theme }) => theme.mixins.toolbar);

const App = ({ config }: { config: IConfig }) => (
  <ThemeProvider theme={createCustomTheme(config)}>
    <CssBaseline />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <AppBar position='fixed'>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              '& svg': {
                width: 120,
                height: 48
              }
            }}
          >
            <DXOSIcon />
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button
            variant='contained'
          >
            Refresh
          </Button>
        </Toolbar>
      </AppBar>
      <AppBarOffset />
      <Paper
        sx={{
          padding: 2,
          overflow: 'scroll'
        }}
      >
        <pre>
          {JSON.stringify(config, undefined, 2)}
        </pre>
      </Paper>
    </Box>
  </ThemeProvider>
);

const start = (config: IConfig) => {
  ReactDOM.render((
    <App config={config} />
  ), document.getElementById('root'));
};

void loadConfig().then(start);
