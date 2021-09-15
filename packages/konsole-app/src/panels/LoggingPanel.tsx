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

// curl -s -H "Content-type: application/json" -X POST
//   -d '{"name":"app-server", "incremental": true,"uniqueId":"<uniqueIdPerKonsoleAppInstance>"}'
//   https://discovery.kube.dxos.network/kube/logs  | jq

// TODO(burdon): Config.
const KUBE_LOGS = 'https://logs.kube.dxos.network/kube/services';

const useLogs = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    setImmediate(async () => {
      const result = await superagent.post(KUBE_LOGS)
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
export const LoggingPanel = () => {
  const classes = useStyles();
  const logs = useLogs();

  return (
    <div className={classes.panel}>
      <JsonTreeView className={classes.json} data={logs} />
    </div>
  );
};
