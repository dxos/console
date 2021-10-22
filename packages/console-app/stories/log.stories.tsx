//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';

import {
  LogTable,
  generateHistoricalMessages
} from '../src';

import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'LogTable'
};

export const Primary = () => {
  const messages = generateHistoricalMessages(100);

  return (
    <RootContainer config={config}>
      <LogTable
        messages={messages}
      />
    </RootContainer>
  );
};
