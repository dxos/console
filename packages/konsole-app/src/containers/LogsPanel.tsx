//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { LogTable, Panel, Toolbar } from '../components';
import { useConfig, useRequest, useServices } from '../hooks';
import { ILogMessage, ipfsLogParser, defaultLogParser } from '../logging';

const parsers: {[index: string]: any} = {
  'ipfs': ipfsLogParser, // TODO(burdon): Update lint settings to allow this.
  'ipfs-swarm-connect': ipfsLogParser
};

const getParser = (service: string) => parsers[service] || defaultLogParser;

// TODO(burdon): Config.
// curl -s -H "Content-type: application/json" -X POST -d '{"name":"app-server", "incremental": true,"uniqueId":"<uniqueIdPerKonsoleAppInstance>"}' https://discovery.kube.dxos.network/kube/logs | jq
const KUBE_LOGS = 'https://logs.kube.dxos.network/kube/logs';

const useLogs = (service: string | undefined): [ILogMessage[], () => void] => {
  // TODO(burdon): Don't trigger request if service is undefined.
  const [data, refreshData] = useRequest<string[]>({ url: KUBE_LOGS, params: { name: service, lines: 100 } });
  const [logs, setLogs] = useState<ILogMessage[]>([]);

  useEffect(() => {
    if (service) {
      setLogs(data ? data.filter(Boolean).map((message: string) => getParser(service)(message)) : []);
    }
  }, [data]);

  return [logs, refreshData];
};

/**
 * Displays the logging panel.
 */
// TODO(burdon): Scroll to bottom.
export const LogsPanel = () => {
  const config = useConfig();
  const [services = []] = useServices(true);
  const [service, setService] = useState<string | undefined>();
  const [polling, setPolling] = useState(false);
  const [logs, refreshLogs] = useLogs(service);

  useEffect(() => {
    if (service === undefined && services.length) {
      setService(services[0].name);
    }
  }, [services]);

  useEffect(() => {
    const interval = polling ? setInterval(refreshLogs, config.app.pollingPeriod || 5000) : undefined;
    return () => interval && clearInterval(interval);
  }, [polling]);

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
              {services.map(({ name: service }) => (
                <MenuItem key={service} value={service}>{service}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ flex: 1 }} />
          <FormControlLabel control={
            <Switch
              size='small'
              checked={polling}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPolling(event.target.checked)}
            />
          } label='Auto' />
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
      <Paper
        sx={{
          display: 'flex',
          flex: 1
        }}
      >
        <LogTable messages={logs} />
      </Paper>
    </Panel>
  );
};
