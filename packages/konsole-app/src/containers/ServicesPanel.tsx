//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton, Toolbar } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { Panel } from '../components';
import { useRequest } from '../hooks';
import { IService } from '../types';

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
