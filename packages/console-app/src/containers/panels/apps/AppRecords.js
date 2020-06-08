//
// Copyright 2020 DxOS.org
//

import React, { useContext } from 'react';

import { useQuery } from '@apollo/react-hooks';
import Link from '@material-ui/core/Link';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment';

import { BooleanIcon } from '../../../components/BooleanIcon';
import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';
import { getServiceUrl } from '../../../util/config';

import IPFS_STATUS from '../../../gql/ipfs_status.graphql';
import WNS_RECORDS from '../../../gql/wns_records.graphql';

const AppRecords = () => {
  const { config } = useContext(ConsoleContext);
  const [sorter, sortBy] = useSorter('createTime', false);
  const appResponse = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery,
    variables: { type: 'wrn:app' }
  }));

  // TODO(telackey): Does this also need an interval?
  const ipfsResponse = useQueryStatusReducer(useQuery(IPFS_STATUS));

  if (!appResponse || !ipfsResponse) {
    return null;
  }

  const appData = appResponse.wns_records.json;
  const ipfsData = JSON.parse(ipfsResponse.ipfs_status.json);

  const localRefs = new Set(ipfsData.refs.local);

  // TODO(burdon): Test if app is deployed.
  const getAppUrl = ({ name, version }) => {
    const base = getServiceUrl(config, 'app.server');
    const pathComponents = [base];

    // TODO(burdon): Fix.
    // `wire app serve` expects the /wrn/ prefix.
    // That is OK in the production config where we can make it part of the the route,
    // but in development it must be prepended since we don't want to make it part of services.app.server.
    if (!base.startsWith(`/${config.services.app.prefix}`) && !base.endsWith(`/${config.services.app.prefix}`)) {
      pathComponents.push(config.services.app.prefix.substring(1));
    }

    if (version) {
      pathComponents.push(`${name}@${version}`);
    } else {
      pathComponents.push(name);
    }
    return `${pathComponents.join('/')}/`;
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('name')}>Identifier</TableCell>
          <TableCell onClick={sortBy('attributes.displayName')}>Name</TableCell>
          <TableCell onClick={sortBy('version')} size='small'>Version</TableCell>
          <TableCell onClick={sortBy('createTime')} size='small'>Created</TableCell>
          <TableCell size='small'>Downloaded</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {appData.sort(sorter).map(({ id, name, version, createTime, attributes: { displayName, publicUrl, package: hash } }) => {
          const verLink = getAppUrl({ id, name, version, publicUrl });
          const appLink = getAppUrl({ id, name, publicUrl });

          return (
            <TableRow key={id} size='small'>
              <TableCell monospace>
                <Link href={appLink} target={name}>{name}</Link>
              </TableCell>
              <TableCell>{displayName}</TableCell>
              <TableCell monospace>
                <Link href={verLink} target={version}>{version}</Link>
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
