//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import WNS_RECORDS from '../../../gql/wns_records.graphql';

import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Link from '@material-ui/core/Link';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import moment from 'moment';

const BotRecords = () => {
  const { config } = useContext(ConsoleContext);
  const [sorter, sortBy] = useSorter('createTime', false);
  const { data } = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery,
    variables: { attributes: { type: 'wrn:bot' } }
  }));

  if (!data) {
    return null;
  }

  const records = JSON.parse(data.wns_records.json);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('names[0]')}>Identifier</TableCell>
          <TableCell onClick={sortBy('attributes.version')} size='small'>Version</TableCell>
          <TableCell onClick={sortBy('attributes.name')}>Name</TableCell>
          <TableCell onClick={sortBy('attributes.repository')}>Repository</TableCell>
          <TableCell onClick={sortBy('createTime')} size='small'>Created</TableCell>
          <TableCell size='icon' />
        </TableRow>
      </TableHead>
      <TableBody>
        {records.sort(sorter).map(({
          id, names, createTime, attributes: { name: displayName, version, versionUrl, repositoryVersion, repository, homepage }
        }) => {
          const url = repository || homepage;
          if (!versionUrl && repository && repositoryVersion && repository.includes('github')) {
            versionUrl = `${repository}/tree/${repositoryVersion}`.replace('-dirty', '');
          }
          return (
            <TableRow key={id} size='small'>
              <TableCell monospace>{names.map(name => <div key={name}>{name}</div>)}</TableCell>
              <TableCell monospace>
                {versionUrl
                  ? <Link href={versionUrl}>{version}</Link>
                  : version}
              </TableCell>
              <TableCell>{displayName}</TableCell>
              <TableCell>
                {url &&
                  <Link href={url} target={url}>{url}</Link>}
              </TableCell>
              <TableCell>{moment.utc(createTime).fromNow()}</TableCell>
              <TableCell />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BotRecords;
