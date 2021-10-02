//
// Copyright 2021 DXOS.org
//

import {
  Check as TrueIcon,
  Clear as Falseicon
} from '@mui/icons-material';
import { Box, Checkbox, IconButton } from '@mui/material';
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
    key: 'checked',
    width: 120
  },
  {
    key: 'id',
    title: 'ID',
    width: 120
  },
  {
    key: 'title',
    title: 'Title',
    sortable: true
  },
  {
    key: 'status',
    width: 120,
    sortable: true
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

  const renderCell = ({ key, value, rowSelected }: RenderCellProps) => {
    switch (key) {
      case 'checked': {
        return (
          <div>
            <Checkbox checked />
          </div>
        );
      }

      case 'status': {
        return (
          <IconButton>
            {value ? <TrueIcon /> : <Falseicon />}
          </IconButton>
        );
      }

      case 'title': {
        const lines = value.split('.').filter(Boolean);
        return (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: 42
              }}
            >
              {lines[0]}
            </Box>
            {rowSelected && lines.slice(1).map((line: string, i: number) => (
              <div key={i}>{line}</div>
            ))}
          </>
        );
      }
    }
  };

  const getRowHeight = ({ row, rowSelected }: GetRowHeightProps) => {
    let h = 42;
    if (rowSelected) {
      const lines = row.title.split('.').filter(Boolean);
      h += (lines.length - 1) * 21 + 10;
    }

    return h;
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
    checked: i % 5 === 0,
    title: faker.lorem.sentences(1 + faker.random.number(3)),
    status: i % 3 === 0
  }));

  return (
    <RootContainer config={config}>
      <Table rows={rows} />
    </RootContainer>
  );
};
