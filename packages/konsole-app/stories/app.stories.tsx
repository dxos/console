//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';
import StoryRouter from 'storybook-react-router';

import { MockRegistryApi } from '@dxos/registry-api';

import { createCustomTheme, panels, App, Debug as DebugApp } from '../src';

import { config } from './config';

debug.enable('dxos:console:*');

// TODO(burdon): Themes not working.

export default {
  title: 'App',
  decorators: [
    StoryRouter()
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
  return (
    <DebugApp config={config} />
  );
};
