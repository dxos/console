//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import React, { useEffect, useState } from 'react';

import { Bot, BotFactoryClient } from '@dxos/bot-factory-client';
import { PublicKey } from '@dxos/crypto';
import { useBotFactoryClient } from '@dxos/react-client';


import { Stop as StopIcon, PlayArrow as StartIcon, DeleteForever as RemoveIcon, Sync as RefreshIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';

import { DataGrid, Panel, Toolbar } from '../components';
import { useConfig } from '../hooks';
import { getRelativeTimeDelta } from '../util';

interface ColumsProps {
  bfClient: BotFactoryClient,
  inProgress: string[],
  setInProgress: React.Dispatch<React.SetStateAction<string[]>>
}

interface BotRow {
  id?: string,
  status?: string,
  dxn?: string,
  actions: any
}

const doBotAction = (botId: string, props: ColumsProps) => async (action: 'START' | 'STOP' | 'REMOVE') => {
  const { bfClient, setInProgress } = props;

  setInProgress(inProgress => [...inProgress, botId]);
  try {
    const handle = bfClient.get(botId);
    switch (action) {
      case 'START': await handle.start(); break;
      case 'STOP': await handle.stop(); break;
      case 'REMOVE': await handle.remove(); break;
    }
  } catch (e) {
    console.error(e);
  } finally {
    setInProgress(inProgress => inProgress.filter(id => id !== botId));
  }
}

const getBotStatus = (bot: Bot) => {
  assert(bot.status, 'Bot status is not defined');
  if (bot.lastStart && bot.status === Bot.Status.RUNNING) {
    return 'UP ' + getRelativeTimeDelta(bot.lastStart);
  }
  return Bot.Status[bot.status];
}

const columns: (props: ColumsProps) => GridColDef[] = (props: ColumsProps) => [
  {
    field: 'id',
    headerName: 'Bot Id',
    headerAlign: 'center',
    flex: 1,
    align: 'center',
    cellClassName: 'monospace secondary'
  },
  {
    field: 'status',
    headerName: 'Status',
    headerAlign: 'center',
    flex: 1,
    align: 'center'
  },
  {
    field: 'dxn',
    headerName: 'DXN',
    headerAlign: 'center',
    flex: 1,
    align: 'center'
  },
  {
    field: 'actions',
    headerName: 'Actions',
    headerAlign: 'center',
    flex: 1,
    align: 'center',
    sortable: false,
    renderCell: (params: GridCellParams) => {
      const id = params.id as string;
      let inProgress = props.inProgress.includes(id);
      const actions = doBotAction(id, props);
      if (params.value) {
        return (
          <>
            <Tooltip title='Start'>
              <IconButton 
                size='small' 
                color='success'
                disabled={inProgress}
                onClick={() => actions('START')}
              >
                <StartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Stop'>
              <IconButton 
                size='small'
                color='warning'
                disabled={inProgress}
                onClick={() => actions('STOP')}
              >
                <StopIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove'>
              <IconButton
                size='small'
                color='error'
                disabled={inProgress}
                onClick={() => actions('REMOVE')}
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      }
    }
  }
];

/**
 * Displays the status of bot containers.
 */
export const BotsPanel = () => {
  const config = useConfig();
  const botClient = useBotFactoryClient(config);
  const [bots, setBots] = useState<BotRow[]>([]);
  const [inProgress, setInProgress] = useState<string[]>([]); // Bot ids that have requests in progress

  const refresh = async () => {
    if (botClient) {
      await botClient.start(PublicKey.from(config.get('runtime.services.bot.topic')!));
      const bots = await botClient.list();
      setBots(bots.map(bot => ({
        id: bot.id,
        status: getBotStatus(bot),
        dxn: bot.packageSpecifier?.dxn,
        actions: {}
      })));
    }
  };

  useEffect(() => {
    setImmediate(async () => {
      await refresh();
    })
  }, [botClient])

  if (!botClient) {
    return null;
  }

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size='small'
            aria-label='refresh'
            onClick={refresh}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}>
      <DataGrid
        rows={bots}
        columns={columns({ bfClient: botClient, inProgress, setInProgress })}
        getRowId={row => row.id}
      />
    </Panel>
  );
};
