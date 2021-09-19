//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Sync as RefreshIcon } from '@mui/icons-material';

import { useRequest } from '../hooks';
import { IService } from './types';

// TODO(burdon): Standarize panels.
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  expand: {
    flex: 1
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  }
}));

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Service',
    width: 200
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 120
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120
  },
]

// TODO(burdon): Config.
const KUBE_SERVICES = 'https://logs.kube.dxos.network/kube/services';

// curl -s https://discovery.kube.dxos.network/kube/services | jq

/**
 * Displays the config panel
 */
export const ServicesPanel = () => {
  const classes = useStyles();
  const [services, refreshServices] = useRequest<IService[]>(KUBE_SERVICES, {}, false);
  if (!services) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Toolbar>
        <div className={classes.expand} />
        <IconButton
          size='small'
          aria-label='refresh'
          onClick={refreshServices}
        >
          <RefreshIcon />
        </IconButton>
      </Toolbar>
      <div className={classes.panel}>
        <DataGrid
          rows={services}
          columns={columns}
          getRowId={({ name }) => name}
        />
      </div>
    </div>
  );
};
