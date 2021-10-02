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

import { GetRowHeightProps, DataCellProps, VirtualTable } from '../src';
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

const CustomDataCell = ({ key, row, value, rowSelected }: DataCellProps): JSX.Element | undefined => {
  switch (key) {
    case 'checked': {
      return (
        <div>
          <Checkbox
            checked={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              row[key] = event.target.checked;
            }}
          />
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
              flexShrink: 0,
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

const Table = ({ rows }: { rows: any[] }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const handleSelect = (next: string[]) => {
    if (next.length && selected[0] === next[0]) {
      setSelected([]);
    } else {
      setSelected(next);
    }
  };

  const getRowHeight = ({ row, rowSelected }: GetRowHeightProps) => {
    let h = 42;
    if (rowSelected) {
      const lines = row.title.split('.').filter(Boolean);
      if (lines.length > 1) {
        h += (lines.length - 1) * 21 + 10;
      }
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
      renderCell={CustomDataCell}
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

/**
 * Test DOM expansion.
 */
export const Test = () => {
  const [lines, setLines] = useState<string[]>([faker.lorem.sentences(1)]);

  const handleToggle = () => {
    if (lines.length === 1) {
      setLines([...lines, ...faker.lorem.sentences(10).split('.').filter(Boolean)]);
    } else {
      setLines(lines.slice(0, 1));
    }
  };

  return (
    <Box
      sx={{
        margin: 2,
        border: '1px solid grey',
        width: 360
      }}
    >
      {/* Row */}
      <Box
        onClick={handleToggle}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'scroll',
          height: 42 + (lines.length > 1 ? 8 + (18 * 4) : 0),
          cursor: 'pointer'
        }}
      >
        {/* Main Cell */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: 0,
            height: 42,
            backgroundColor: 'gainsboro',
            paddingLeft: 1,
            paddingRight: 1
          }}
        >
          {/* Content should be in a div -- Box only for flex */}
          <div
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {lines[0]}
          </div>
        </Box>
        {/* Expanded Cell */}
        {lines.length > 1 && (
          <Box
            sx={{
              padding: 1,
              overflowY: 'scroll'
            }}
          >
            {lines.slice(1).map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
