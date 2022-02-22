//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useState } from 'react';

import {
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { IconButton, Tooltip, Paper, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { BotFactoryClient } from '@dxos/bot-factory-client';

import { Panel, Toolbar } from './Panel';

export interface BotLogsProps {
  botClient: BotFactoryClient,
  selectedBot: string,
  selectBot: React.Dispatch<React.SetStateAction<string | undefined>>,
}

export const BotLogs = ({
  botClient,
  selectedBot,
  selectBot
}: BotLogsProps) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handle = botClient.get(selectedBot);
    const stream = handle.logsStream();
    stream.subscribe((msg) => {
      const { chunk } = msg;
      if (chunk) {
        setLogs(logs => [...logs, chunk.toString()]);
      }
    }, () => {
      setLogs(logs => [...logs, 'Stream ended.']);
    });
    () => stream.close();
  }, []);

  console.log(logs);

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <Tooltip title='Back'>
            <IconButton
              size='small'
              aria-label='refresh'
              onClick={() => selectBot(undefined)}
            >
              <BackIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      )}>
      <Paper sx={{ overflow: 'scroll', padding: 1 }}>
        <Typography variant='h6'>
          Bot {selectedBot}
        </Typography>
        <Divider />
        <pre>
          {logs.join('\n')}
        </pre>
      </Paper>
    </Panel>
  );
};
