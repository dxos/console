//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React from 'react';

import { FlexTable, ScrollContainer, useTestMessages } from '../src';
import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'FlexTable'
};

export const Primary = () => {
  const messages = useTestMessages(55);

  const columns = [
    {
      id: 'timestamp',
      label: 'ts',
      sort: true
    },
    {
      id: 'level',
      width: 150
    },
    {
      id: 'message'
    }
  ];

  return (
    <RootContainer config={config}>
      <FlexTable
        columns={columns}
        rows={messages}
        paging={true}
        cellRenderer={({ row, id }) => {
          if (id === 'timestamp') {
            return (
              <div style={{ whiteSpace: 'nowrap', fontFamily: 'monospace', color: 'darkGreen' }}>{row[id]}</div>
            );
          }
        }}
      />
    </RootContainer>
  );
};

export const Virtual = () => {
  const rows = [...new Array(100)].map((_, i) => ({ id: String(i), title: `Item-${i}` }));

  return (
    <RootContainer config={config}>
      <ScrollContainer
        rows={rows}
        getRowKey={({ row }) => row.id}
      />
    </RootContainer>
  );
};
