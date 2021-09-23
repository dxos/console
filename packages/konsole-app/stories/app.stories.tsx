//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';
// import StoryRouter from 'storybook-react-router';

// "storybook-react-router": "^1.0.8",
// "@types/string-hash": "^1.1.1",

import { MockRegistryApi } from '@dxos/registry-api';

import { createCustomTheme, panels, App, Debug as DebugApp } from '../src';

import { config } from './config';

debug.enable('dxos:console:*');

// TODO(burdon): Themes not working.

export default {
  title: 'App',
  decorators: [
    // StoryRouter()
  ]
};

export const Primary = () => {
  const theme = createCustomTheme(config);

  return (
    <App
      config={config}
      registryApi={MockRegistryApi}
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
