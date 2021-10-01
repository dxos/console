//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import faker from 'faker';
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
    title: 'ID',
    width: 100
  },
  {
    key: 'title',
    title: 'Title',
    sort: true
  },
  {
    key: 'toggle',
    width: 100,
    sort: true
  }
];

const Table = ({ rows }: { rows: any[] }) => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <VirtualTable
      rows={rows}
      columns={columns}
      getRowKey={({ row }) => row.id}
      selected={selected}
      onSelect={setSelected}
    />
  );
};

export const Primary = () => {
  const rows = [...new Array(100)].map((_, i) => ({
    id: `item-${i}`,
    title: faker.lorem.sentences(1 + faker.random.number(3)).split('.').join('.\n'),
    toggle: i % 3 === 0
  }));

  return (
    <RootContainer config={config}>
      <Table rows={rows} />
    </RootContainer>
  );
};
