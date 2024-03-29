//
// Copyright 2021 DXOS.org
//

import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';

import { Config } from '@dxos/config';
import { FullScreen } from '@dxos/react-components';

import { createCustomTheme } from '../src';

export const config = new Config({
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
});

export const RootContainer = ({ config, children }: { config: Config, children: JSX.Element }) => {
  return (
    <ThemeProvider theme={createCustomTheme(config)}>
      <CssBaseline />
      <FullScreen>
        {children}
      </FullScreen>
    </ThemeProvider>
  );
};
