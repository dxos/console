//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React, { useState } from 'react';

import { VirtualTable } from '../src';
import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'Virtual'
};

const columns = [
  {
    key: 'id',
    width: 100
  },
  {
    key: 'title',
    title: 'Title'
  },
  {
    key: 'toggle',
    width: 100
  }
];

export const Primary = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const rows = [...new Array(100)].map((_, i) => ({
    id: `item-${i}`,
    title: `Item ${i}`,
    toggle: i % 3 === 0
  }));

  return (
    <RootContainer config={config}>
      <VirtualTable
        rows={rows}
        columns={columns}
        getRowKey={({ row }) => row.id}
        selected={selected}
        onSelect={setSelected}
      />
    </RootContainer>
  );
};
