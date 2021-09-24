//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { DomainKey } from '@dxos/registry-api';

import { DataGrid, Panel, Toolbar } from '../components';
import { useDomains } from '../hooks';

const columns: GridColDef[] = [
  {
    field: 'domainKey',
    headerName: 'Key',
    width: 200,
    cellClassName: 'monospace',
    valueFormatter: ({ value: domainKey }) => {
      return (domainKey as DomainKey).toHex();
    }
  },
  {
    field: 'name',
    headerName: 'Domain',
    width: 300
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
