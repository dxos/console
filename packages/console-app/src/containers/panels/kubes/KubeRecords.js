//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import moment from 'moment';

import { useQuery } from '@apollo/react-hooks';
import Link from '@material-ui/core/Link';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import WNS_RECORDS from '../../../gql/wns_records.graphql';

import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

const KubeRecords = () => {
  const { config } = useContext(ConsoleContext);
  const [sorter, sortBy] = useSorter('names[0]');
  const { data: appResponse } = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery,
    variables: { attributes: { type: 'wrn:kube' } }
  }));

  if (!appResponse) {
    return null;
  }

  const appData = JSON.parse(appResponse.wns_records.json);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('names[0]')}>Registered Names</TableCell>
          <TableCell onClick={sortBy('attributes.version')} size='small'>Version</TableCell>
          <TableCell onClick={sortBy('attributes.name')}>Name</TableCell>
          <TableCell onClick={sortBy('createTime')} size='small'>Created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {appData.sort(sorter).map(({ id, names, createTime, attributes: { name: displayName, version, url } }) => {
          return (
            <TableRow key={id} size='small'>
              <TableCell monospace>
                {names.map(wrn => <div key={wrn}>{url ? <Link href={url}>{wrn}</Link> : { wrn }}</div>)}
              </TableCell>
              <TableCell monospace>
                {version}
              </TableCell>
              <TableCell>
                {displayName}
              </TableCell>
              <TableCell>{moment.utc(createTime).fromNow()}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default KubeRecords;
