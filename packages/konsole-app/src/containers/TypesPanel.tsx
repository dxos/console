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
    field: 'cid',
    headerName: 'Record CID',
    width: 180,
    cellClassName: 'monospace secondary',
    renderCell: ({ value: cid }) => {
      return <RecordLink cid={cid as CID} />;
    }
  },
  {
    field: 'messageName',
    headerName: 'Protobuf Message',
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
        getRowId={({ cid }) => cid}
      />
    </Panel>
  );
};
