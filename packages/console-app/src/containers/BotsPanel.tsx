//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { Bot, BotFactoryClient } from '@dxos/bot-factory-client';
import { useBotFactoryClient } from '@dxos/react-client';


import { Stop as StopIcon, Start as StartIcon, Remove as RemoveIcon, Sync as RefreshIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';

import { DataGrid, Panel, Toolbar } from '../components';
import { useConfig } from '../hooks';

interface ColumsProps {
  bfClient: BotFactoryClient,
  inProgress: string[],
  setInProgress: React.Dispatch<React.SetStateAction<string[]>>
}

interface BotRow {
  id?: string,
  status?: string
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

const columns: (props: ColumsProps) => GridColDef[] = (props: ColumsProps) => [
  {
    field: 'id',
    headerName: 'Id',
    width: 400,
    cellClassName: 'monospace secondary'
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 180
  },
  {
    field: 'id',
    headerName: 'Actions',
    sortable: false,
    renderCell: (params: GridCellParams) => {
      const id = params.value as string;
      let inProgress = props.inProgress.includes(id);
      const actions = doBotAction(id, props);
      if (params.value) {
        return (
          <>
            <IconButton 
              size='small' 
              color='success'
              disabled={inProgress}
              onClick={() => actions('START')}
            >
              <StartIcon />
            </IconButton>
            <IconButton 
              size='small'
              color='warning'
              disabled={inProgress}
              onClick={() => actions('STOP')}
            >
              <StopIcon />
            </IconButton>
            <IconButton
              size='small'
              color='error'
              disabled={inProgress}
              onClick={() => actions('REMOVE')}
            >
              <RemoveIcon />
            </IconButton>
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
      const bots = await botClient.list();
      setBots(bots.map(bot => ({
        id: bot.id,
        status: Bot.Status[bot.status!],
      })))
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
