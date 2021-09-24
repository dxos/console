//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { Panel, Toolbar } from '../components';
import { useRequest } from '../hooks';
import { IService } from '../types';

const format = new Intl.NumberFormat('en', { maximumSignificantDigits: 3 });

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Service',
    width: 200
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 200
  },
  {
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

// TODO(burdon): Config.
// curl -s https://discovery.kube.dxos.network/kube/services | jq
const KUBE_SERVICES = 'https://logs.kube.dxos.network/kube/services';

/**
 * Displays the config panel
 */
export const ServicesPanel = () => {
  const [services, refreshServices] = useRequest<IService[]>({ url: KUBE_SERVICES, method: 'GET' });

  console.log(services);

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
