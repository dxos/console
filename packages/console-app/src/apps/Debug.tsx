//
// Copyright 2021 DXOS.org
//

import { AppBar, Box, CssBaseline, Paper, Toolbar } from '@mui/material';
import React from 'react';

import { ThemeProvider, ThemeProviderProps, styled } from '@material-ui/core/styles';

import { JsonView } from '../components';
import { IConfig } from '../hooks';
import { DXOS as DXOSIcon } from '../icons';

const AppBarOffset = styled('div')(({ theme }) => theme.mixins.toolbar as any);

interface DebugProps {
  config: IConfig
  theme: ThemeProviderProps['theme']
}

/**
 * Simple Debug app (mostly for sanity testing the console framework).
 */
export const Debug = ({ config, theme }: DebugProps) => {
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
