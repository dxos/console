//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import moment from 'moment';

import { useQuery } from '@apollo/react-hooks';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Link from '@material-ui/core/Link';

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
  const { data: appResponse } = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery,
    variables: { attributes: { type: 'wrn:app' } }
  }));

  // TODO(telackey): Does this also need an interval?
  const { data: ipfsResponse } = useQueryStatusReducer(useQuery(IPFS_STATUS));
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
          <TableCell onClick={sortBy('attributes.repository')}>Repository</TableCell>
          <TableCell onClick={sortBy('createTime')} size='small'>Created</TableCell>
          <TableCell size='icon' />
        </TableRow>
      </TableHead>
      <TableBody>
        {appData.sort(sorter).map(({
          id, names, createTime, attributes: {
            name: displayName, description, version,
            versionUrl, repositoryVersion, repository, homepage, package: packageLink
          }
        }) => {
          const url = repository || homepage;

          // If this is a GitHub repo, it is trivial to construct the URL from the base repository and version.
          if (!versionUrl && repository && repositoryVersion && repository.includes('github')) {
            versionUrl = `${repository}/tree/${repositoryVersion}`.replace('-dirty', '');
          }

          return (
            <TableRow key={id} size='small'>
              <TableCell monospace>
                {names.map(wrn => <div key={wrn}> <AppLink config={config} wrn={wrn} /> </div>)}
              </TableCell>
              <TableCell monospace>
                {versionUrl
                  ? <Link href={versionUrl}>{version}</Link>
                  : version}
              </TableCell>
              <TableCell>
                {displayName || description}
              </TableCell>
              <TableCell>
                {url &&
                  <Link href={url} target={url}>{url}</Link>}
              </TableCell>
              <TableCell>{moment.utc(createTime).fromNow()}</TableCell>
              <TableCell>
                <BooleanIcon yes={localRefs && localRefs.has(packageLink['/'])} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AppRecords;
