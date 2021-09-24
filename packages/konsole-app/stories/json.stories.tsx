//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';

import { JsonView } from '../src';
import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'JSON'
};

export const Primary = () => {
  return (
    <RootContainer config={config}>
      <JsonView data={config} />
    </RootContainer>
  );
};
