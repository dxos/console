//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React, { useMemo } from 'react';

import { MemoryRegistryClient } from '@dxos/registry-client';

import { createCustomTheme, panels, App, Debug as DebugApp } from '../src';
import { config } from './config';

debug.enable('dxos:console:*');

// TODO(burdon): Seems to clash with Mui theme? Wait for version 7?
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
  const registryClient = useMemo(() => new MemoryRegistryClient(), []);
  console.log(registryClient);

  return (
    <App
      config={config}
      registryApi={registryClient}
      panels={panels}
      theme={theme}
    />
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
