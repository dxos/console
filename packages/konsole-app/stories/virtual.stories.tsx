//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';

import { VirtualTable } from '../src';
import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'Virtual'
};

export const Primary = () => {
  const rows = [...new Array(100)].map((_, i) => ({ id: String(i), title: `Item-${i}` }));

  return (
    <RootContainer config={config}>
      <VirtualTable
        rows={rows}
        getRowKey={({ row }) => row.id}
      />
    </RootContainer>
  );
};
