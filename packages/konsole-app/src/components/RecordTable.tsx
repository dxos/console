//
// Copyright 2021 DXOS.org
//

import React from 'react';
import { Launch as LaunchIcon } from '@mui/icons-material';
import { Box, IconButton, Link } from '@mui/material';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';

import { IRecord } from '../types';
import { getRelativeTime, sortDateStrings } from '../util';

// TODO(burdon): Common fields for all records.
// TODO(burdon): Different record type views may have different column sets.
// TODO(burdon): Upgrade to XGrid to have resizable columns.
//   https://mui.com/components/data-grid/#mit-vs-commercial
// https://mui.com/components/data-grid/columns
const columns: GridColDef[] = [
  {
    field: 'cid',
    headerName: 'CID',
    width: 130,
    sortable: false,
    cellClassName: () => 'monospace',
    valueFormatter: (params) => {
      return (params.value as string).slice(0, 8) + '...';
    }
  },
  {
    field: 'created',
    headerName: 'Created',
    width: 140,
    valueFormatter: (params) => {
      return params.value && getRelativeTime(params.value as Date);
    },
    // https://mui.com/components/data-grid/sorting
    sortComparator: (v1, v2) => sortDateStrings(v1 as string, v2 as string)
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 120,
    cellClassName: () => 'monospace'
  },
  {
    field: 'name',
    headerName: 'Resource Name',
    minWidth: 300,
    cellClassName: () => 'monospace'
  },
  {
    field: 'title',
    headerName: 'Display Name',
    minWidth: 300,
    cellClassName: () => 'title'
  },
  {
    field: 'url',
    headerName: 'Link',
    width: 120,
    sortable: false,
    // https://mui.com/components/data-grid/style/#styling-cells
    renderCell: (params: GridCellParams) => {
      if (params.value) {
        return (
          <Link target='link' href={params.value as string}>
            <IconButton size='small'>
              <LaunchIcon />
            </IconButton>
          </Link>
        );
      }
    }
  }
];

interface RecordsTableProps {
  records?: IRecord[]
}

/**
 * Table that displays all registry records.
 */
export const RecordTable = ({ records = [] }: RecordsTableProps) => {
  // TODO(burdon): Convert to FlexTable.
  // https://mui.com/api/data-grid/data-grid
  // https://mui.com/components/data-grid/#mit-version
  return (
    <Box
      sx={{
        flex: 1
      }}
    >
      <DataGrid
        rows={records}
        columns={columns}
        getRowId={({ cid }) => cid}
      />
    </Box>
  );
};
