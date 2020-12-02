//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

import SIGNAL_STATUS from '../../../gql/signal_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

const SignalChannels = () => {
  const { config } = useContext(ConsoleContext);
  const { data } = useQueryStatusReducer(useQuery(SIGNAL_STATUS, { fetchPolicy: 'no-cache', pollInterval: config.api.pollInterval, context: { api: 'signal' } }));
  if (!data) {
    return null;
  }

  const { nodes = [] } = data.signal_status;

  const channels = new Map();
  nodes.forEach(node => {
    const { signal: { topics = [] } } = node;
    topics.forEach(topic => {
      if (!channels.has(topic.id)) {
        channels.set(topic.id, {
          id: topic.id,
          peers: topic.peers
        });
        return;
      }

      const ch = channels.get(topic.id);
      ch.peers = [...ch.peers, ...topic.peers];
    });
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Channel</TableCell>
          <TableCell size='small'>Participants</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from(channels.values()).map(({ id, peers = [] }) => {
          return (
            <TableRow key={id} size='small'>
              <TableCell monospace>
                {id}
              </TableCell>
              <TableCell monospace>
                {peers.length}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SignalChannels;
