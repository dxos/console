//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { AppBar, Box, CssBaseline, Paper, Toolbar } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';

import { IConfig } from '../hooks';
import { DXOS as DXOSIcon } from '../icons';
import { createCustomTheme } from '../theme';

const AppBarOffset = styled('div')(({ theme }) => theme.mixins.toolbar);

interface DebugProps {
  config: IConfig
}

/**
 * Simple Debug app (mostly for sanity testing the console framework).
 */
export const Debug = ({ config }: DebugProps) => {
  return (
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
        <AppBar
          position='fixed'
          sx={{
            color: theme => theme.palette.mode === 'dark' ? theme.palette.background.default: undefined,
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
}
