//
// Copyright 2020 DxOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import WNS_RECORDS from '../../../gql/wns_records.graphql';

import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import moment from 'moment';

const AppRecords = () => {
  const { config } = useContext(ConsoleContext);
  const [sorter, sortBy] = useSorter('createTime', false);
  const data = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery,
    variables: { type: 'wrn:bot' }
  }));

  if (!data) {
    return null;
  }

  const records = data.wns_records.json;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('name')}>Identifier</TableCell>
          <TableCell onClick={sortBy('version')} size="small">Version</TableCell>
          <TableCell onClick={sortBy('createTime')} size="small">Created</TableCell>
          <TableCell onClick={sortBy('attributes.displayName')}>Name</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {records.sort(sorter).map(({ id, name, version, createTime, attributes: { displayName } }) => {
          return (
            <TableRow key={id} size="small">
              <TableCell monospace>{name}</TableCell>
              <TableCell monospace>{version}</TableCell>
              <TableCell>{moment.utc(createTime).fromNow()}</TableCell>
              <TableCell>{displayName}</TableCell>
              <TableCell />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AppRecords;
