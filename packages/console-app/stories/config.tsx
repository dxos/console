//
// Copyright 2021 DXOS.org
//

import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';

import { ConfigObject } from '@dxos/config';
import { FullScreen } from '@dxos/react-components';

import { createCustomTheme } from '../src';

export const config: ConfigObject = {
  module: {
    build: {
      version: '1.0.0'
    },
  },
  runtime: {
    props: {
      title: 'Test'
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
      },
      ipfs: {
        gateway: 'test-ipfs-gateway',
        server: 'test-ipfs-server'
      },
      signal: {
        api: ''
      }
    },
    system: {
      debug: 'stories'
    }
  }
};

export const RootContainer = ({ config, children }: { config: ConfigObject, children: JSX.Element }) => {
  return (
    <ThemeProvider theme={createCustomTheme(config)}>
      <CssBaseline />
      <FullScreen>
        {children}
      </FullScreen>
    </ThemeProvider>
  );
};
