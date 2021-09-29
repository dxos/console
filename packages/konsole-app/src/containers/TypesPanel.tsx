//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { DataGrid, Panel, Toolbar, truncate } from '../components';
import { useRecordTypes } from '../hooks';

const columns: GridColDef[] = [
  {
    field: 'type',
    headerName: 'Record CID',
    width: 180,
    cellClassName: 'monospace secondary',
    valueFormatter: (params) => truncate(params.value?.toString() as string)
  },
  {
    field: 'label',
    headerName: 'Message',
    width: 300,
    cellClassName: 'primary'
  }
];

/**
 * Displays all defined tyeps.
 */
export const TypesPanel = () => {
  const types = useRecordTypes();

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size='small'
            aria-label='refresh'
            onClick={() => {}}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}
    >
      <DataGrid
        rows={types || []}
        columns={columns}
        getRowId={({ type }) => type}
      />
    </Panel>
  );
};
