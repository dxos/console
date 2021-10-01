//
// Copyright 2021 DXOS.org
//

import {
  Check as TrueIcon,
  Clear as Falseicon
} from '@mui/icons-material';
import debug from 'debug';
import faker from 'faker';
import React, { useState } from 'react';

import { GetRowHeightProps, RenderCellProps, VirtualTable } from '../src';
import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

faker.seed(123);

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
  const handleSelect = (next: string[]) => {
    if (next.length && selected[0] === next[0]) {
      setSelected([]);
    } else {
      setSelected(next);
    }
  };

  // TODO(burdon): Render multi-line.
  const renderCell = ({ key, value, rowSelected }: RenderCellProps) => {
    switch (key) {
      case 'toggle': {
        return value ? <TrueIcon /> : <Falseicon />;
      }

      case 'title': {
        const lines = value.split('.').filter(Boolean);
        if (rowSelected) {
          return lines.map((line: string, i: number) => <div key={i}>{line}</div>);
        } else {
          return <div>{lines[0]}</div>;
        }
      }
    }
  };

  const getRowHeight = ({ row, rowSelected }: GetRowHeightProps) => {
    if (rowSelected) {
      const lines = row.title.split('.').filter(Boolean);
      return 42 + (lines.length - 1) * 21;
    }

    return 42;
  };

  return (
    <VirtualTable
      rows={rows}
      columns={columns}
      getRowKey={row => row.id}
      getRowHeight={getRowHeight}
      selected={selected}
      onSelect={handleSelect}
      renderCell={renderCell}
    />
  );
};

export const Primary = () => {
  const rows = [...new Array(100)].map((_, i) => ({
    id: `item-${i}`,
    title: faker.lorem.sentences(1 + faker.random.number(3)),
    toggle: i % 3 === 0
  }));

  return (
    <RootContainer config={config}>
      <Table rows={rows} />
    </RootContainer>
  );
};
