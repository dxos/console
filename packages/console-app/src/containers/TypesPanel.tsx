//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { useRecordTypes } from '@dxos/react-registry-client';
import { CID } from '@dxos/registry-client';

import { DataGrid, Panel, RecordLink, Toolbar } from '../components';

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
  const { recordTypes } = useRecordTypes();

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
        rows={recordTypes || []}
        columns={columns}
        getRowId={({ cid }) => cid}
      />
    </Panel>
  );
};
