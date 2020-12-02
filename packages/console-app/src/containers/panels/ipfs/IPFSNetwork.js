//
// Copyright 2020 DXOS.org
//

import React from 'react';
import get from 'lodash.get';

import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import IPFS_STATUS from '../../../gql/ipfs_status.graphql';
import WNS_RECORDS from '../../../gql/wns_records.graphql';

import { useQueryStatusReducer } from '../../../hooks';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import { BooleanIcon } from '../../../components/BooleanIcon';

const RECORD_TYPE = 'wrn:service';
const SERVICE_TYPE = 'ipfs';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    flex: 1,
    overflowY: 'scroll'
  },

  table: {
    tableLayout: 'fixed',

    '& th': {
      fontVariant: 'all-small-caps',
      fontSize: 18,
      cursor: 'ns-resize'
    }
  },

  connected: {
    fontWeight: 'bold'
  },

  disconnected: {
    fontStyle: 'italic'
  },

  colShort: {
    width: '30%'
  },

  colWide: {},

  colBoolean: {
    width: '10%'
  },

  caption: {
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.primary.contrastText,
    paddingLeft: '1em',
    margin: 0
  }
}));

const IPFSStatus = () => {
  const classes = useStyles();

  const { data: ipfsResponse } = useQueryStatusReducer(useQuery(IPFS_STATUS));
  const { data: wnsResponse } = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    variables: { attributes: { type: RECORD_TYPE, service: SERVICE_TYPE } }
  }));

  if (!wnsResponse || !ipfsResponse) {
    return null;
  }

  const ipfsData = JSON.parse(ipfsResponse.ipfs_status.json);
  const registeredServers = JSON.parse(wnsResponse.wns_records.json).filter(record => get(record, 'attributes.ipfs.active') !== false);

  const displayServers = registeredServers.map((service) => {
    const addresses = get(service, 'attributes.ipfs.addresses');
    let connected = false;
    for (const address of addresses) {
      const parts = address.split('/');
      const nodeId = parts[parts.length - 1];
      connected = !!ipfsData.swarm.peers.find(({ peer }) => peer === nodeId);
      if (connected) {
        break;
      }
    }

    return {
      ...service.attributes,
      ...service.attributes.ipfs,
      names: get(service, 'names'),
      version: get(service, 'version'),
      connected
    };
  });

  displayServers.sort((a, b) => {
    return a.connected && !b.connected ? -1 : b.connected && !a.connected ? 1 : b.name < a.name ? 1 : -1;
  });

  if (displayServers.length === 0) {
    displayServers.push({ name: 'None' });
  }

  // TODO(burdon): Get Address (currenlty truncated).

  return (
    <Table stickyHeader size='small' className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Registered Names</TableCell>
          <TableCell size='medium'>Description</TableCell>
          <TableCell>Address</TableCell>
          <TableCell size='small'>Connected</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {displayServers.map(({ names, description, addresses, connected }) => (
          <TableRow key={names}>
            <TableCell>{names.map(name => <>{name}<br /></>)}</TableCell>
            <TableCell>{description}</TableCell>
            <TableCell>
              {addresses}
            </TableCell>
            <TableCell>
              <BooleanIcon yes={connected} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default IPFSStatus;
