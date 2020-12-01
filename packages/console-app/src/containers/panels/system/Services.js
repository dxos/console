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
import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';
import SERVICE_STATUS from '../../../gql/service_status.graphql';

const format = (value, unit, symbol = '') => Math.floor(value / unit).toLocaleString() + symbol;

const SignalServers = () => {
  const { config } = useContext(ConsoleContext);
  const [sorter] = useSorter('name');
  const { data: serviceResponse } = useQueryStatusReducer(useQuery(SERVICE_STATUS, { pollInterval: config.api.intervalQuery }));
  if (!serviceResponse) {
    return null;
  }

  const services = JSON.parse(serviceResponse.service_status.json);
  const total = services.reduce((value, { memory }) => value + memory, 0);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell style={{ width: 120 }}>Status</TableCell>
            <TableCell style={{ width: 140, textAlign: 'right' }}>Memory</TableCell>
            <TableCell style={{ width: 120, textAlign: 'right' }}>CPU</TableCell>
            <TableCell>Command</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.sort(sorter).map(({ name, memory, cpu, status, exec }) => {
            return (
              <TableRow key={name} size='small'>
                <TableCell monospace>
                  {name}
                </TableCell>
                <TableCell>
                  {status}
                </TableCell>
                <TableCell style={{ textAlign: 'right' }} monospace>
                  {format(memory, 1000, 'K')}
                </TableCell>
                <TableCell style={{ textAlign: 'right' }} monospace>
                  {cpu.toFixed(1)}
                </TableCell>
                <TableCell monospace>
                  {exec}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableBody>
          <TableRow>
            <TableCell style={{ fontVariant: 'all-small-caps' }}>Total</TableCell>
            <TableCell />
            <TableCell style={{ textAlign: 'right' }} monospace>
              {format(total, 1000, 'K')}
            </TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SignalServers;
