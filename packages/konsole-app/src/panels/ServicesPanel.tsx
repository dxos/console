//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React, { useEffect, useState } from 'react';
import superagent from 'superagent';

import { makeStyles, IconButton, Toolbar } from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import {
  Sync as RefreshIcon
} from '@material-ui/icons';

import { IService } from './types';

const log = debug('dxos:console:panel:logging');

// TODO(burdon): Standarize panels.
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  toolbar: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  expand: {
    flex: 1
  },
  panel: {
    display: 'flex',
    flex: 1,
    margin: theme.spacing(1)
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

const useServices = (): [IService[], () => void] => {
  const [time, setTime] = useState(Date.now());
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    let active = true;

    log('Requesting', KUBE_SERVICES);
    setImmediate(async () => {
      const result = await superagent.get(KUBE_SERVICES)
        .set('accept', 'json'); // TODO(burdon): Change to POST.

      if (active) {
        const services = result.body;
        setServices(services);
      }
    });

    return () => { active = false };
  }, [time]);

  return [services, () => setTime(Date.now())];
};

/**
 * Displays the config panel
 * @constructor
 */
export const ServicesPanel = () => {
  const classes = useStyles();
  const [services, handleRefresh] = useServices();

  return (
    <div className={classes.root}>
      <Toolbar className={classes.toolbar} disableGutters>
        <div className={classes.expand} />
        <IconButton
          size='small'
          aria-label='refresh'
          onClick={handleRefresh}
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

// className={classes.iconButton}
