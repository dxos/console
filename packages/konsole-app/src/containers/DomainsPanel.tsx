//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { DomainKey } from '@dxos/registry-client';

import { truncate, DataGrid, Panel, Toolbar } from '../components';
import { useDomains } from '../hooks';

const columns: GridColDef[] = [
  {
    field: 'domainKey',
    headerName: 'Key',
    width: 180,
    cellClassName: 'monospace secondary',
    valueFormatter: ({ value: domainKey }) => truncate((domainKey as DomainKey).toHex())
  },
  {
    field: 'name',
    headerName: 'Domain',
    width: 300,
    cellClassName: 'monospace primary'
  }
];

/**
 * Displays the config panel
 */
export const DomainsPanel = () => {
  const domains = useDomains();

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
        rows={domains || []}
        columns={columns}
        getRowId={({ name }) => name}
      />
    </Panel>
  );
};
