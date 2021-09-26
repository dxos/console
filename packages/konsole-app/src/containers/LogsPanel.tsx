//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, FormControl, IconButton, MenuItem, Paper, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { LogTable, Panel, Toolbar } from '../components';
import { useRequest } from '../hooks';
import { ILogMessage, ipfsLogParser, defaultLogParser } from '../logging';

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
  'ipfs': ipfsLogParser, // TODO(burdon): Update lint settings to allow this.
  'ipfs-swarm-connect': ipfsLogParser
};

const getParser = (service: string) => parsers[service] || defaultLogParser;

// TODO(burdon): Config.
// curl -s -H "Content-type: application/json" -X POST -d '{"name":"app-server", "incremental": true,"uniqueId":"<uniqueIdPerKonsoleAppInstance>"}' https://discovery.kube.dxos.network/kube/logs | jq
const KUBE_LOGS = 'https://logs.kube.dxos.network/kube/logs';

const useLogs = (service: string): [ILogMessage[], () => void] => {
  const [data, refreshData] = useRequest<string[]>({ url: KUBE_LOGS, params: { name: service, lines: 100 } });
  const [logs, setLogs] = useState<ILogMessage[]>([]);

  useEffect(() => {
    setLogs(data ? data.filter(Boolean).map((message: string) => getParser(service)(message)): []);
  }, [data]);

  return [logs, refreshData];
};

/**
 * Displays the config panel
 */
// TODO(burdon): Polling button.
export const LogsPanel = () => {
  const [service, setService] = useState(services[0]);
  const [logs, refreshLogs] = useLogs(service);

  const handleServiceChange = (event: SelectChangeEvent) => {
    setService(event.target.value as string);
  };

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <FormControl variant='standard'>
            <Select
              labelId='label-service'
              value={service || ''}
              onChange={handleServiceChange}
              autoWidth
            >
              {services.map(service => (
                <MenuItem key={service} value={service}>{service}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size='small'
            aria-label='refresh'
            onClick={refreshLogs}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}
    >
      <Paper>
        <LogTable messages={logs} />
      </Paper>
    </Panel>
  );
};
