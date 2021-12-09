//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { DataGrid } from './DataGrid';
import { IRecord, recordsColumns } from './RecordsTable';

export interface IResourceRecord extends IRecord {
  version?: string
  tag?: string
}

// NOTE: Test dimensions on iPad Pro.
// https://mui.com/components/data-grid/columns
const columns: GridColDef[] = [
  ...recordsColumns,
  {
    field: 'tag',
    headerName: 'Tag',
    width: 150,
    cellClassName: () => 'monospace'
  },
  {
    field: 'version',
    headerName: 'Version',
    width: 150,
    cellClassName: () => 'monospace'
  }
];

interface ResourceRecordsTableProps {
  resourceRecords?: IResourceRecord[]
}

/**
 * Table that displays all registry records.
 */
export const ResourceRecordsTable = ({ resourceRecords = [] }: ResourceRecordsTableProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100%'
      }}
    >
      <DataGrid
        rows={resourceRecords}
        columns={columns}
        getRowId={({ cid, tag, version }) => `${cid.toB58String()}@${tag ?? version ?? ''}`}
        disableSelectionOnClick
        hideFooterSelectedRowCount
      />
    </Box>
  );
};
