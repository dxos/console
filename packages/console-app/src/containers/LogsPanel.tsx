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
  Select,
  SelectChangeEvent,
  Switch
} from '@mui/material';
import urlJoin from 'proper-url-join';
import React, { useEffect, useState } from 'react';

import { LogTable, Panel, Toolbar } from '../components';
import { useConfig, useRequest, useServices } from '../hooks';
import { ILogMessage, ipfsLogParser, defaultLogParser } from '../logging';

const parsers: {[index: string]: any} = {
  ipfs: ipfsLogParser, // TODO(burdon): Update lint settings to allow this.
  'ipfs-swarm-connect': ipfsLogParser
};

const getParser = (service: string) => parsers[service] || defaultLogParser;

const useLogs = (service: string | undefined): [ILogMessage[], () => void] => {
  const config = useConfig();
  // TODO(burdon): Don't trigger request if service is undefined.
  const [data, refreshData] = useRequest<string[]>({
    url: urlJoin(config.services.app.server, config.services.kube.endpoints.logs),
    params: { name: service, lines: 100 }
  });
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
      <LogTable messages={logs} />
    </Panel>
  );
};
