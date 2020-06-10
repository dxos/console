//
// Copyright 2020 DxOS.org
//

import React, { useState } from 'react';
import get from 'lodash.get';

import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import IPFS_STATUS from '../../../gql/ipfs_status.graphql';
import WNS_RECORDS from '../../../gql/wns_records.graphql';

import { useQueryStatusReducer } from '../../../hooks';

import Json from '../../../components/Json';
import Panel from '../../../components/Panel';
import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import Toolbar from '../../../components/Toolbar';
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

const TAB_STATUS = 'status';
const TAB_LOG = 'log';

const IPFS = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_STATUS);

  const ipfsResponse = useQueryStatusReducer(useQuery(IPFS_STATUS));
  const wnsResponse = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    variables: { attributes: { type: RECORD_TYPE, service: SERVICE_TYPE } }
  }));

  if (!wnsResponse || !ipfsResponse) {
    return null;
  }

  const ipfsData = JSON.parse(ipfsResponse.ipfs_status.json);
  const registeredServers = JSON.parse(wnsResponse.wns_records.json);

  const displayServers = registeredServers.map((service) => {
    console.error(service);
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
      name: get(service, 'name'),
      version: get(service, 'version'),
      description: get(service, 'attributes.description'),
      ipfs: get(service, 'attributes.ipfs'),
      connected
    };
  });

  displayServers.sort((a, b) => {
    return a.connected && !b.connected ? -1 : b.connected && !a.connected ? 1 : b.name < a.name ? 1 : -1;
  });

  if (displayServers.length === 0) {
    displayServers.push({ name: 'None' });
  }

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_STATUS} label='Status' />
            <Tab value={TAB_LOG} label='Log' />
          </Tabs>
        </Toolbar>
      }
    >
      <h4 className={classes.caption}>WNS-registered IPFS Servers</h4>
      <Table stickyHeader size='small' className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Identifier</TableCell>
            <TableCell size='medium'>Description</TableCell>
            <TableCell size='icon'>Connected</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayServers.map(({ name, description, ipfs, connected }) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>{description}</TableCell>
              <TableCell>
                <BooleanIcon yes={connected} />
              </TableCell>
              <TableCell>
                {ipfs.addresses}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h4 className={classes.caption}>Local IPFS Server</h4>
      <Json data={{
        id: ipfsData.id.id,
        version: ipfsData.id.agentVersion,
        addresses: ipfsData.id.addresses,
        peers: ipfsData.swarm.peers.length,
        numObjects: ipfsData.repo.stats.numObjects,
        repoSize: ipfsData.repo.stats.repoSize
      }}
      />
    </Panel>
  );
};

export default IPFS;
