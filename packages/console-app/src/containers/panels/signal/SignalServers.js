//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

import SIGNAL_STATUS from '../../../gql/signal_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

const SignalServers = () => {
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(SIGNAL_STATUS, { pollInterval: config.api.intervalQuery }));
  if (!data) {
    return null;
  }

  const { json: { channels = [] } } = data.signal_status;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Server</TableCell>
            <TableCell size='small' s>Peers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {channels.map(({ channel, peers = [] }) => {
            return (
              <TableRow key={channel} size='small'>
                <TableCell monospace>
                  {channel}
                </TableCell>
                <TableCell monospace>
                  {peers.length}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SignalServers;
