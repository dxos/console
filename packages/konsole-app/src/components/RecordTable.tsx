//
// Copyright 2021 DXOS.org
//

import { Launch as LaunchIcon } from '@mui/icons-material';
import { Box, IconButton, Link } from '@mui/material';
import { GridColDef, GridCellParams, GridRowId } from '@mui/x-data-grid';
import React, { useState } from 'react';

import { IRecord } from '../types';
import { getRelativeTime, sortDateStrings } from '../util';
import { truncate, DataGrid } from './DataGrid';

// TODO(burdon): Common fields for all records.
// TODO(burdon): Different record type views may have different column sets.
// TODO(burdon): Upgrade to XGrid to have resizable columns.
//   https://mui.com/components/data-grid/#mit-vs-commercial
// https://mui.com/components/data-grid/columns
const columns: GridColDef[] = [
  {
    field: 'cid',
    headerName: 'CID',
    width: 180,
    sortable: false,
    cellClassName: () => 'monospace secondary',
    valueFormatter: (params) => truncate(params.value as string)
  },
  {
    field: 'created',
    headerName: 'Created',
    width: 140,
    valueFormatter: (params) => {
      return params.value && getRelativeTime(new Date(params.value as number));
    },
    // https://mui.com/components/data-grid/sorting
    sortComparator: (v1, v2) => sortDateStrings(v1 as string, v2 as string)
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
    cellClassName: () => 'monospace'
  },
  {
    field: 'name',
    headerName: 'Resource Name',
    width: 400,
    cellClassName: () => 'monospace'
  },
  {
    field: 'title',
    headerName: 'Display Name',
    minWidth: 400,
    cellClassName: () => 'primary',
    flex: 1
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
            <IconButton size='small' color='primary'>
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
  onSelect?: (id: string | undefined) => void
}

/**
 * Table that displays all registry records.
 */
export const RecordTable = ({ records = [], onSelect }: RecordsTableProps) => {
  const [selected, setSelected] = useState<GridRowId | undefined>();

  const handleSelect = (id: GridRowId) => {
    const next = (id === selected) ? undefined : id;
    setSelected(next);
    if (onSelect) {
      onSelect(next as string);
    }
  };

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
        selectionModel={selected ? [selected] : []}
        onRowClick={({ id }) => handleSelect(id)}
        disableSelectionOnClick
        hideFooterSelectedRowCount
      />
    </Box>
  );
};
