//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useState } from 'react';
import superagent from 'superagent';

import { makeStyles } from '@material-ui/core';

import { JsonTreeView } from '@dxos/react-ux';

import { IService } from './types';

const useStyles = makeStyles(theme => ({
  panel: {
    display: 'flex',
    flex: 1,
    overflow: 'scroll',
    margin: theme.spacing(1)
  },
  json: {
    width: '100%'
  }
}));

// TODO(burdon): Config.
const KUBE_SERVICES = 'https://logs.kube.dxos.network/kube/services';

// curl -s https://discovery.kube.dxos.network/kube/services | jq

const useServices = () => {
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    console.log('Requesting', KUBE_SERVICES);
    setImmediate(async () => {
      const result = await superagent.get(KUBE_SERVICES)
        .set('accept', 'json'); // TODO(burdon): Change to POST.

      const services = result.body;
      setServices(services);
    });
  }, []);

  return services;
};

/**
 * Displays the config panel
 * @constructor
 */
export const ServicesPanel = () => {
  const classes = useStyles();
  const services = useServices();

  return (
    <div className={classes.panel}>
      <JsonTreeView className={classes.json} data={services} />
    </div>
  );
};
