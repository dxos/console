//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';

import { RegistryProvider } from '@dxos/react-registry-client';
import { MemoryRegistryClient } from '@dxos/registry-client';

import { createCustomTheme, panels, App, Debug as DebugApp } from '../src';
import { config } from './config';

debug.enable('dxos:console:*');

const memoryRegistryClient = new MemoryRegistryClient();

// TODO(burdon): Seems to clash with Mui theme?
// import StoryRouter from 'storybook-react-router';
// "storybook-react-router": "^1.0.8"
// "@types/storybook-react-router": "^1.0.1",

export default {
  title: 'Apps',
  decorators: [
    // StoryRouter()
  ]
};

export const Primary = () => {
  const theme = createCustomTheme(config);

  return (
    <RegistryProvider registry={memoryRegistryClient}>
      <App
        config={config}
        panels={panels}
        theme={theme}
      />
    </RegistryProvider>
  );
};

export const Debug = () => {
  const theme = createCustomTheme(config);

  return (
    <DebugApp
      config={config}
      theme={theme}
    />
  );
};
