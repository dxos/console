/* eslint-disable */ 

import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import BOT_LIST from '../../../gql/bot_list.graphql';
import BOT_KILL from '../../../gql/bot_kill.graphql';

import { ConsoleContext, useQueryStatusReducer, useStatusReducer } from '../../../hooks';

import { useSorter } from '../../../hooks';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import BotControls from '../../../components/BotControls';
import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import moment from 'moment';

const RunningBots = () => {
  const { config } = useContext(ConsoleContext);
  const [sorter, sortBy] = useSorter('started', false);
  const [botList, setBotList] = useState([]);
  const [, setStatus] = useStatusReducer();

  const botListResponse = useQueryStatusReducer(useQuery(BOT_LIST, {
    pollInterval: config.api.pollInterval
  }));

  useEffect(() => {
    if (botListResponse) {
      const botListData = JSON.parse(botListResponse.bot_list.json);
      setBotList(botListData);
    }
  }, [botListResponse]);

  const [killBot] = useMutation(BOT_KILL);

  const onKillBot = async (botId) => {
    const botKillResponse = await killBot({ variables: { botId }});
    if (botKillResponse && botKillResponse.data) {
      const { botId, error } = JSON.parse(botKillResponse.data.bot_kill.json);
      if (error) {
        setStatus({ error });
      } else {
        const newBotList = botList.filter(bot => bot.botId !== botId);
        setBotList(newBotList);
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
                  <BotControls onStop={() => onKillBot(botId)}/>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default RunningBots;