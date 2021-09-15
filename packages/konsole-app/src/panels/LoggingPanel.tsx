//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React, { useEffect, useState } from 'react';
import superagent from 'superagent';

import { makeStyles, Divider, IconButton, MenuItem, Select, Toolbar } from '@material-ui/core';
import {
  Sync as RefreshIcon
} from '@material-ui/icons';

import { Log } from '../components';
import { ILogMessage, ipfsLogParser, defaultLogParser } from '../logging';
import { TEST_LOGS } from '../testing';

const log = debug('dxos:console;panel:logging');

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  expand: {
    flex: 1
  },
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

// curl -s -H "Content-type: application/json" -X POST -d '{"name":"app-server", "incremental": true,"uniqueId":"<uniqueIdPerKonsoleAppInstance>"}' https://discovery.kube.dxos.network/kube/logs | jq

// TODO(burdon): Get from query.
const services = [
  'app-server',
  'bot-factory',
  'console',
  'dxns', // TODO(burdon): Fix logging (double timestamp).
  'ipfs',
  'ipfs-swarm-connect',
  'kube', // TODO(burdon): Fix logging (double timestamp).
  'mdns',
  'signal' // TODO(burdon): Logs multi-line excpetions to multiple lines.
];

const parsers: {[index: string]: any} = {
  'ipfs': ipfsLogParser,
  'ipfs-swarm-connect': ipfsLogParser
};

const getParser = (service: string) => parsers[service] || defaultLogParser;

// TODO(burdon): Factor out pattern.
const useLogs = (service: string): [ILogMessage[], () => void] => {
  const [time, setTime] = useState(Date.now());
  const [logs, setLogs] = useState<ILogMessage[]>([]);

  useEffect(() => {
    let active = true;

    log('Requesting', KUBE_LOGS);
    setImmediate(async () => {
      const result = await superagent.post(KUBE_LOGS)
        .set('accept', 'json')
        .send({
          name: service,
          lines: 100
        });

      if (active) {
        const lines = result.body as string[];
        setLogs(lines.filter(Boolean).map(message => getParser(service)(message)));
      }
    });

    return () => { active = false };
  }, [service, time]);

  return [logs, () => setTime(Date.now())];
};

/**
 * Displays the config panel
 */
// TODO(burdon): Tail polling button.
export const LoggingPanel = () => {
  const classes = useStyles();
  const [service, setService] = useState(services[0]);
  const [logs, handleRefresh] = useLogs(service);

  const handleServiceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setService(event.target.value as string);
  };

  return (
    <div className={classes.root}>
      <Toolbar>
        <Select
          labelId='label-service'
          variant='outlined'
          value={service || ''}
          onChange={handleServiceChange}
          autoWidth
        >
          {services.map(service => (
            <MenuItem key={service} value={service}>{service}</MenuItem>
          ))}
        </Select>
        <div className={classes.expand} />
        <IconButton
          size='small'
          aria-label='refresh'
          onClick={handleRefresh}
        >
          <RefreshIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <div className={classes.panel}>
        <Log messages={logs} />
      </div>
    </div>
  );
};
