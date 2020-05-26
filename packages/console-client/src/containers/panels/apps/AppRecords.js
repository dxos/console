//
// Copyright 2020 DxOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import WNS_RECORDS from '../../../../gql/wns_records.graphql';

import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';

import Link from '@material-ui/core/Link';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import { getServiceUrl } from '../../../util/config';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

const AppRecords = () => {
  const { config } = useContext(ConsoleContext);
  const [sorter, sortBy] = useSorter('id');
  const data = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.pollInterval,
    variables: { type: 'wrn:app' }
  }));

  if (!data) {
    return null;
  }

  const records = data.wns_records.json;

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

    pathComponents.push(`${name}@${version}`);
    return pathComponents.join('/');
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('name')}>ID</TableCell>
          <TableCell onClick={sortBy('version')} size="small">Version</TableCell>
          <TableCell onClick={sortBy('attributes.displayName')}>Name</TableCell>
          <TableCell>Link</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {records.sort(sorter).map(({ id, name, version, attributes: { displayName, publicUrl } }) => {
          const link = getAppUrl({ id, name, version, publicUrl });

          return (
            <TableRow key={id} size="small">
              <TableCell monospace>{name}</TableCell>
              <TableCell monospace>{version}</TableCell>
              <TableCell>{displayName}</TableCell>
              <TableCell monospace>
                {link && (
                  <Link href={link} target={name}>{link}</Link>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AppRecords;
