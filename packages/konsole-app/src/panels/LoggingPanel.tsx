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

// TODO(burdon): Config.
const KUBE_LOGS = 'https://logs.kube.dxos.network/kube/logs';

// TODO(burdon): Create mocks.
// curl -s -H "Content-type: application/json" -X POST -d '{"name":"app-server", "incremental": true,"uniqueId":"<uniqueIdPerKonsoleAppInstance>"}' https://discovery.kube.dxos.network/kube/logs | jq
// "2021-09-15T13:45:32.254974423Z   dxos:cli-app:server Not found in DXNS: dxos:application +90ms\r",

const useLogs = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    console.log('Requesting', KUBE_LOGS);
    setImmediate(async () => {
      const result = await superagent.post(KUBE_LOGS)
        .set('accept', 'json')
        .send({
          name: 'app-server',
          lines: 100
        });

      const lines = result.body;
      setServices(lines);
    });
  }, []);

  return services;
};

/**
 * Displays the config panel
 */
// TODO(burdon): Refresh button.
// TODO(burdon): Tail polling button.
export const LoggingPanel = () => {
  const classes = useStyles();
  const logs = useLogs();

  return (
    <div className={classes.panel}>
      <JsonTreeView className={classes.json} data={logs} />
    </div>
  );
};
