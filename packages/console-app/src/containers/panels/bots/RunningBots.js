/* eslint-disable */ 

import React from 'react';

import { data } from './RunningBotsData';

import { useSorter } from '../../../hooks';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import BotControls from '../../../components/BotControls';
import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import moment from 'moment';

const RunningBots = () => {
  const [sorter, sortBy] = useSorter('createTime', false);

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
        {data.sort(sorter).map(({ id, botId, started, stopped, parties }) => {
            return (
              <TableRow key={botId} size='small'>
                <TableCell monospace>{id}</TableCell>
                <TableCell monospace>{botId}</TableCell>
                <TableCell>{moment.utc(started).fromNow()}</TableCell>
                <TableCell monospace>{String(stopped)}</TableCell>
                <TableCell monospace>{parties.map(partyId => <div key={partyId}>{partyId}</div>)}</TableCell>
                <TableCell monospace>
                  <BotControls />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default RunningBots;