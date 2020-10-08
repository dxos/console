//
// Copyright 2020 DXOS.org
//

import React, { useContext, useRef, useEffect, useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import useComponentSize from '@rehooks/component-size';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import NetworkGraph from '../../../components/NetworkGraph';

import SIGNAL_STATUS from '../../../gql/signal_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

const NODE_ID_LENGTH = 8;

const buildDataGraph = (rootId, prevGraph, nodes) => {
  const newGraph = { nodes: [], links: [] };

  const rootNode = nodes.find(n => n.id === rootId);

  nodes.forEach(node => {
    let type = 'detach';
    if (rootId === node.id) {
      type = 'root';
    } else {
      const isAdjacent = rootNode.connections.find(conn => conn.target === node.id) || node.connections.find(conn => conn.target === rootId);
      if (isAdjacent) {
        type = 'adjacent';
      }
    }

    const oldNode = prevGraph.nodes.find(n => n.id === node.id) || {};
    const newNode = { ...oldNode, id: node.id, label: node.id.slice(0, NODE_ID_LENGTH).toUpperCase(), type, data: node };
    if (type === 'root') {
      newNode.fx = 0;
      newNode.fy = 0;
    }
    newGraph.nodes.push(newNode);
  });

  nodes.forEach(node => {
    node.connections.forEach(conn => {
      newGraph.links.push({ id: conn.id, source: node.id, target: conn.target });
    });
  });

  return newGraph;
};

const useDataGraph = (response) => {
  const [dataGraph, setDataGraph] = useState({ updatedAt: 0, nodes: [], links: [] });

  useEffect(() => {
    if (!response) return;
    const { id: rootId, nodes = [] } = response.signal_status;
    const updatedAt = moment(response.signal_status.updatedAt).valueOf();

    if (dataGraph.updatedAt >= updatedAt) return;

    const graph = buildDataGraph(rootId, dataGraph, nodes);
    setDataGraph({
      updatedAt,
      ...graph
    });
  }, [response && response.signal_status.updatedAt]);

  return dataGraph;
};

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
});

function Row (props) {
  const { row } = props;

  const classes = useRowStyles();

  const system = row.kubeStatus.system;

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>{row.id.slice(0, NODE_ID_LENGTH).toUpperCase()}</TableCell>
        <TableCell align='right'>{row.signal.topics.reduce((prev, curr) => prev + curr.peers.length, 0)}</TableCell>
        <TableCell align='right'>{system?.version || '-'}</TableCell>
        <TableCell align='right'>{system?.nodejs?.version || '-'}</TableCell>
        <TableCell align='right'>{system?.memory?.used || '-'}</TableCell>
        <TableCell align='right'>{system?.memory?.total || '-'}</TableCell>
        <TableCell align='right'>{system?.time?.up ? moment(system?.time?.up).format('lll') : '-'}</TableCell>
      </TableRow>
    </>
  );
}

function SignalServers () {
  const { config } = useContext(ConsoleContext);
  const response = useQueryStatusReducer(useQuery(SIGNAL_STATUS, { fetchPolicy: 'no-cache', pollInterval: config.api.pollInterval, context: { api: 'signal' } }));

  const data = useDataGraph(response);

  const sizeRef = useRef(null);
  const { width, height } = useComponentSize(sizeRef);

  const [open, setOpen] = useState(null);

  const handleOpen = useCallback(
    (id) => {
      if (open && open === id) {
        setOpen(null);
      } else {
        setOpen(id);
      }
    },
    [open]
  );

  return (
    <Grid container spacing={0} direction='column' alignItems='stretch' ref={sizeRef}>
      <Grid item xs>
        <NetworkGraph
          width={width}
          height={height / 2}
          graph={data}
          onTooltip={(node) => {
            return (
              <>
                <strong>WebRTC Peers:</strong> {node.signal.topics.reduce((prev, curr) => prev + curr.peers.length, 0)}
                <br />
                {node.kubeStatus.services.map((service) => {
                  return <span key={service.name}><strong>{service.name}:</strong> {service.status}<br /></span>;
                })}
              </>);
          }}
        />
      </Grid>
      <Grid item xs>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Signal</TableCell>
                <TableCell align='right'>Peers (WebRTC)</TableCell>
                <TableCell align='right'>Kube version</TableCell>
                <TableCell align='right'>Node.JS version</TableCell>
                <TableCell align='right'>Memory usage</TableCell>
                <TableCell align='right'>Memory total</TableCell>
                <TableCell align='right'>Uptime</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.nodes.map(({ data }) => {
                return <Row key={data.id} row={data} open={open && open === data.id} setOpen={handleOpen} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default SignalServers;
