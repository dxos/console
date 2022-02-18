//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { Bot, BotFactoryClient } from '@dxos/bot-factory-client';
import { useBotFactoryClient } from '@dxos/react-client';


import { Launch as LaunchIcon, Sync as RefreshIcon } from '@mui/icons-material';
import { IconButton, Link } from '@mui/material';
import { Box } from '@mui/system';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';

import { DataGrid, Panel, Toolbar } from '../components';
import { ArrayElement } from '../util';

interface ColumsProps {
  bfClient: BotFactoryClient,
  requestsInProgress: string[] // list of bot ids that have pending request
}

const columns: (props: ColumsProps) => GridColDef[] = (props: ColumsProps) => [
  {
    field: 'id',
    headerName: 'Id',
    width: 400,
    cellClassName: 'monospace secondary'
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 180
  },
  {
    field: 'url',
    headerName: 'Link',
    width: 120,
    sortable: false,
    // https://mui.com/components/data-grid/style/#styling-cells
    renderCell: (params: GridCellParams) => {
      if (props.requestsInProgress.includes(params.id.toString())) {
        // this bot has a requies in progress
        return
      }
      if (params.value) {
        return (
          <Link target='link' href={params.value as string}>
            <IconButton size='small' color='primary'>
              <LaunchIcon />
            </IconButton>
          </Link>
        );
      }
    }
  }
];

// class Bot {
//   public readonly id: string;
//   public readonly status: string;
//   public requestInProgress = false;
//   private readonly _bfClient: BotFactoryClient;

//   constructor (bfClient: BotFactoryClient, id: string, status: number) {
//     this._bfClient = bfClient;
//     this.id = id;
//     this.status = status === 0 ? 'RUNNING' : 'STOPPED'; //todo use protobuf enum
//   }

//   get actions() {
//     return {
//       requestInProgress: this.requestInProgress,
//       start: async () => {
//         this.requestInProgress = true;
//         await this._bfClient.startBot(this.id);
//         this.requestInProgress = false;
//       }
//     };
//   }
// }

/**
 * Displays the status of bot containers.
 */
export const BotsPanel = () => {
  const botClient = useBotFactoryClient();
  const [bots, setBots] = useState<any[]>([]);
  const [inProgress, setInprogress] = useState<string[]>([]); // Bot ids that have requests in progress

  const refresh = async () => {
    if (botClient) {
      const bots = await botClient.list();
      setBots(bots.map(bot => ({
        id: bot.id,
        status: Bot. bot.status,
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
        columns={columns({bfClient: botClient, requestsInProgress: inProgress})}
        getRowId={row => row.id}
      />
    </Panel>
  );
};
