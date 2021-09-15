//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useState } from 'react';
import superagent from 'superagent';

import { makeStyles } from '@material-ui/core';

import { JsonTreeView } from '@dxos/react-ux';

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

// curl -s https://discovery.kube.dxos.network/kube/services | jq

// TODO(burdon): Config.
const KUBE_SERVICES = 'https://discovery.kube.dxos.network/kube/services';

const useStatus = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    setImmediate(async () => {
      const result = await superagent.get(KUBE_SERVICES)
        .set('accept', 'json')
        .withCredentials();

      console.log(result);
      setServices([]);
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
  const status = useStatus();

  return (
    <div className={classes.panel}>
      <JsonTreeView className={classes.json} data={status} />
    </div>
  );
};
