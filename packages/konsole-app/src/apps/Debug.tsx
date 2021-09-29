//
// Copyright 2021 DXOS.org
//

import { AppBar, Box, CssBaseline, Paper, Toolbar } from '@mui/material';
import { styled, Theme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

import { JsonView } from '../components';
import { IConfig } from '../hooks';
import { DXOS as DXOSIcon } from '../icons';

const AppBarOffset = styled('div')(({ theme }) => theme.mixins.toolbar);

interface DebugProps {
  config: IConfig
  theme: Theme
}

/**
 * Simple Debug app (mostly for sanity testing the console framework).
 */
export const Debug = ({ config, theme }: DebugProps) => {
  console.log(theme);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <AppBar
          position='fixed'
          sx={{
            color: theme => theme.palette.mode === 'dark' ? theme.palette.background.default : undefined,
            backgroundColor: theme => theme.palette.primary.main
          }}
        >
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
          </Toolbar>
        </AppBar>
        <AppBarOffset />

        <Paper
          sx={{
            overflow: 'scroll',
            padding: 1
          }}
        >
          <JsonView data={config} />
        </Paper>
      </Box>
    </ThemeProvider>
  );
};
