//
// Copyright 2021 DXOS.org
//

import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';

import { FullScreen } from '@dxos/react-components';

import { createCustomTheme, IConfig } from '../src';

export const config: IConfig = {
  app: {
    title: 'Test'
    // theme: 'dark'
  },
  build: {
    version: '1.0.0'
  },
  registry: {
    endpoint: ''
  },
  services: {
    kube: {
      endpoints: {
        logs: '',
        services: ''
      }
    },
    dxns: {
      server: 'test-dxns-server'
    },
    app: {
      prefix: 'test-prefix',
      server: 'test-server'
    }
  },
  system: {
    debug: 'stories'
  }
};

export const RootContainer = ({ config, children }: { config: IConfig, children: JSX.Element }) => {
  return (
    <ThemeProvider theme={createCustomTheme(config)}>
      <CssBaseline />
      <FullScreen>
        {children}
      </FullScreen>
    </ThemeProvider>
  );
};
