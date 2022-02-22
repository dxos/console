//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import React, { useEffect, useState } from 'react';

import {
  Stop as StopIcon,
  PlayArrow as StartIcon,
  DeleteForever as RemoveIcon,
  Sync as RefreshIcon,
  List as ListIcon
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';

import { Bot, BotFactoryClient } from '@dxos/bot-factory-client';
import { PublicKey } from '@dxos/crypto';

import { getRelativeTimeDelta } from '../util';
import { DataGrid } from './DataGrid';
import { Panel, Toolbar } from './Panel';

interface ColumsProps {
  bfClient: BotFactoryClient,
  inProgress: string[],
  setInProgress: React.Dispatch<React.SetStateAction<string[]>>,
  refresh: () => Promise<void>,
  selectBot: React.Dispatch<React.SetStateAction<string | undefined>>
}

interface BotRow {
  id?: string,
  status?: string,
  dxn?: string,
  partyKey?: PublicKey,
  actions: any
}

const doBotAction = (botId: string, props: ColumsProps) => async (action: 'START' | 'STOP' | 'REMOVE') => {
  const { bfClient, setInProgress, refresh } = props;

  setInProgress(inProgress => [...inProgress, botId]);
  try {
    const handle = bfClient.get(botId);
    switch (action) {
      case 'START': await handle.start(); break;
      case 'STOP': await handle.stop(); break;
      case 'REMOVE': await handle.remove(); break;
    }
    await refresh();
  } catch (e) {
    console.error(e);
  } finally {
    setInProgress(inProgress => inProgress.filter(id => id !== botId));
  }
};

const getBotStatus = (bot: Bot) => {
  assert(bot.status !== undefined, 'Bot status is not defined');
  if (bot.lastStart && bot.status === Bot.Status.RUNNING) {
    return 'UP ' + getRelativeTimeDelta(bot.lastStart);
  }
  return Bot.Status[bot.status];
};

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
    field: 'partyKey',
    headerName: 'Party Key',
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
      const inProgress = props.inProgress.includes(id);
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
            <Tooltip title='Show logs'>
              <IconButton
                size='small'
                color='info'
                onClick={() => props.selectBot(id)}
              >
                <ListIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      }
    }
  }
];

export interface BotsTableProps {
  selectBot: React.Dispatch<React.SetStateAction<string | undefined>>,
  botClient: BotFactoryClient
}

/**
 * Displays basic info about bots.
 */
export const BotsTable = ({ selectBot, botClient } : BotsTableProps) => {
  const [bots, setBots] = useState<BotRow[]>([]);
  const [inProgress, setInProgress] = useState<string[]>([]); // Bot ids that have requests in progress

  const refresh = async () => {
    if (botClient) {
      const bots = await botClient.list();
      setBots(bots.map(bot => ({
        id: bot.id,
        status: getBotStatus(bot),
        dxn: bot.packageSpecifier?.dxn,
        partyKey: bot.partyKey,
        actions: {}
      })));
    }
  };

  useEffect(() => {
    setImmediate(async () => {
      await refresh();
    });
  }, [botClient]);

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
        columns={columns({ bfClient: botClient, inProgress, setInProgress, refresh, selectBot })}
        getRowId={row => row.id}
      />
    </Panel>
  );
};
