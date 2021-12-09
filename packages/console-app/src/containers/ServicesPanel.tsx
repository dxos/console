//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { DataGrid, Panel, Toolbar } from '../components';
import { useServices } from '../hooks';

const format = new Intl.NumberFormat('en', { maximumSignificantDigits: 3 });

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Service',
    width: 200,
    cellClassName: 'primary'
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 200
  },
  {
    // TODO(burdon): Color based on status.
    field: 'status',
    headerName: 'Status',
    width: 140
  },
  {
    field: 'cpu',
    headerName: 'CPU',
    width: 140,
    align: 'right',
    cellClassName: 'monospace',
    valueFormatter: ({ value }) => (value as number).toFixed(2)
  },
  {
    field: 'memory',
    headerName: 'Memory',
    width: 160,
    align: 'right',
    cellClassName: 'monospace',
    valueFormatter: ({ value }) => format.format(value as number / 1000) + 'K'
  }
];

/**
 * Displays the config panel
 */
export const ServicesPanel = () => {
  const [services, refreshServices] = useServices(true);

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size='small'
            aria-label='refresh'
            onClick={refreshServices}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}
    >
      <DataGrid
        rows={services || []}
        columns={columns}
        getRowId={({ name }) => name}
      />
    </Panel>
  );
};
