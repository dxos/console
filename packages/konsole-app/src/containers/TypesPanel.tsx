//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { CID } from '@dxos/registry-api';

import { DataGrid, Panel, RecordLink, Toolbar } from '../components';
import { useRecordTypes } from '../hooks';

const columns: GridColDef[] = [
  {
    field: 'label', // TODO(burdon): Incorrect field. Should be key.
    headerName: 'Message',
    width: 300,
    cellClassName: 'primary'
  },
  {
    field: 'type',
    headerName: 'Record CID',
    width: 180,
    cellClassName: 'monospace secondary',
    renderCell: ({ value: cid }) => {
      return <RecordLink cid={cid as CID} />;
    }
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
