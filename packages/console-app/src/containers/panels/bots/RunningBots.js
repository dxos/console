//
// Copyright 2020 DXOS.org
//

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import BOT_LIST from '../../../gql/bot_list.graphql';
import BOT_KILL from '../../../gql/bot_kill.graphql';

import { useQueryStatusReducer, useStatusReducer, useSorter } from '../../../hooks';

import BotControls from '../../../components/BotControls';
import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

const RunningBots = () => {
  const [sorter, sortBy] = useSorter('started', false);
  const [botList, setBotList] = useState([]);
  const [, setStatus] = useStatusReducer();

  const { data: botListResponse, refetch } = useQueryStatusReducer(useQuery(BOT_LIST));

  useEffect(() => {
    if (botListResponse) {
      const botListData = JSON.parse(botListResponse.bot_list.json);
      setBotList(botListData);
    }
  }, [botListResponse]);

  const [killBot] = useMutation(BOT_KILL);

  const onKillBot = async (botId) => {
    const botKillResponse = await killBot({ variables: { botId } });
    if (botKillResponse && botKillResponse.data) {
      const { error } = JSON.parse(botKillResponse.data.bot_kill.json);
      if (error) {
        setStatus({ error });
      } else {
        refetch();
      }
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('id')}>Identifier</TableCell>
          <TableCell onClick={sortBy('botId')} size='small'>Bot Id</TableCell>
          <TableCell onClick={sortBy('started')}>Started</TableCell>
          <TableCell onClick={sortBy('stopped')}>Stopped</TableCell>
          <TableCell onClick={sortBy('parties')} size='small'>Parties</TableCell>
          <TableCell size='icon' />
        </TableRow>
      </TableHead>
      <TableBody>
        {botList.sort(sorter).map(({ id, botId, started, stopped, parties }) => {
          return (
            <TableRow key={botId} size='small'>
              <TableCell monospace>{id}</TableCell>
              <TableCell monospace>{botId}</TableCell>
              <TableCell>{moment.utc(started).fromNow()}</TableCell>
              <TableCell monospace>{String(stopped)}</TableCell>
              <TableCell monospace>{parties && parties.map(partyId => <div key={partyId}>{partyId}</div>)}</TableCell>
              <TableCell monospace>
                <BotControls onStop={() => onKillBot(botId)} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default RunningBots;
