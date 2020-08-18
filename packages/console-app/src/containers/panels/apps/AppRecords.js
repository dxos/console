//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import moment from 'moment';

import { useQuery } from '@apollo/react-hooks';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import IPFS_STATUS from '../../../gql/ipfs_status.graphql';
import WNS_RECORDS from '../../../gql/wns_records.graphql';

import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';

import { BooleanIcon } from '../../../components/BooleanIcon';
import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import AppLink from '../../../components/AppLink';

const AppRecords = () => {
  const { config } = useContext(ConsoleContext);
  const [sorter, sortBy] = useSorter('createTime', false);
  const appResponse = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery,
    variables: { attributes: { type: 'wrn://dxos/type/application/web' } }
  }));

  // TODO(telackey): Does this also need an interval?
  const ipfsResponse = useQueryStatusReducer(useQuery(IPFS_STATUS));
  if (!appResponse || !ipfsResponse) {
    return null;
  }

  const appData = JSON.parse(appResponse.wns_records.json);
  const ipfsData = JSON.parse(ipfsResponse.ipfs_status.json);
  const localRefs = new Set(ipfsData.refs.local);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('names[0]')}>Registered Names</TableCell>
          <TableCell onClick={sortBy('attributes.version')} size='small'>Version</TableCell>
          <TableCell onClick={sortBy('attributes.name')}>Name</TableCell>
          <TableCell onClick={sortBy('createTime')} size='small'>Created</TableCell>
          <TableCell size='icon' />
        </TableRow>
      </TableHead>
      <TableBody>
        {appData.sort(sorter).map(({ id, names, createTime, attributes: { name: displayName, version, package: hash } }) => {
          return (
            <TableRow key={id} size='small'>
              <TableCell monospace>
                {names.map(wrn => <>
                  <AppLink config={config} wrn={wrn} />
                  <br />
                  </>
                )}
              </TableCell>
              <TableCell monospace>
                {version}
              </TableCell>
              <TableCell>
                {displayName}
              </TableCell>
              <TableCell>{moment.utc(createTime).fromNow()}</TableCell>
              <TableCell>
                <BooleanIcon yes={localRefs && localRefs.has(hash)} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AppRecords;
