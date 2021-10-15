//
// Copyright 2021 DXOS.org
//

import { Launch as LaunchIcon } from '@mui/icons-material';
import { Box, IconButton, Link } from '@mui/material';
import { GridColDef, GridCellParams, GridRowId } from '@mui/x-data-grid';
import React from 'react';

import { CID } from '@dxos/registry-client';

import { getRelativeTime, sortDateStrings } from '../util';
import { truncate, DataGrid } from './DataGrid';

export interface IRecord {
  cid: CID
  created?: string
  description?: string,
  data?: any,
  type?: string,
  url?: string
}

export interface IResource {
  name: string
  tags?: string[],
  versions?: string[]
}

// NOTE: Test dimensions on iPad Pro.
// https://mui.com/components/data-grid/columns
export const recordsColumns: GridColDef[] = [
  {
    field: 'cid',
    headerName: 'Record CID',
    width: 180,
    sortable: false,
    cellClassName: () => 'monospace secondary',
    valueFormatter: (params) => truncate(params.value?.toString() as string)
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
    cellClassName: () => 'monospace'
  },
  {
    field: 'created',
    headerName: 'Created',
    minWidth: 120,
    valueFormatter: (params) => {
      return params.value && getRelativeTime(new Date(params.value as number));
    },
    // https://mui.com/components/data-grid/sorting
    sortComparator: (v1, v2) => sortDateStrings(v1 as string, v2 as string)
  },
  {
    field: 'description',
    headerName: 'Description',
    minWidth: 280,
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
  selected?: CID
  onSelect?: (cid: CID | undefined) => void
}

/**
 * Table that displays all registry records.
 */
export const RecordsTable = ({ records = [], selected, onSelect }: RecordsTableProps) => {
  const s: GridRowId | undefined = selected?.toB58String() as GridRowId;

  const handleSelect = (id: GridRowId) => {
    const next = (id === s) ? undefined : id;
    // setSelected(next);
    if (onSelect) {
      const cid = next ? CID.fromB58String(next as string) : undefined;
      onSelect(cid);
    }
  };

  // TODO(burdon): Convert to FlexTable.
  // https://mui.com/api/data-grid/data-grid
  // https://mui.com/components/data-grid/#mit-version
  return (
    <Box
      sx={{
        flex: 1,
        height: '100%'
      }}
    >
      <DataGrid
        rows={records}
        columns={recordsColumns}
        getRowId={({ cid }) => cid.toB58String()}
        selectionModel={selected ? [s] : []}
        onRowClick={({ id }) => handleSelect(id)}
        disableSelectionOnClick
        hideFooterSelectedRowCount
      />
    </Box>
  );
};
