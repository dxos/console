//
// Copyright 2020 DXOS.org
//

import React, { useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import useComponentSize from '@rehooks/component-size';

import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

import SIGNAL_STATUS from '../../../gql/signal_status.graphql';

import { useQueryStatusReducer } from '../../../hooks';

import {
  SVG as Svg,
  useGrid,
  useObjectMutator,
} from '@dxos/gem-core';

import {
  Graph,
  ForceLayout,
  NodeProjector
} from '@dxos/gem-spore';

const nodeColors = ['blue', 'yellow', 'red'];
const useCustomStyles = makeStyles(() => ({
  nodes: nodeColors.reduce((map, color) => {
    map[`& g.node.${color} circle`] = { fill: colors[color][400] };
    map['& g.node text'] = { fill: 'white' };
    return map;
  }, {})
}));

const getMetric = (data, name, map = (v) => v) => {
  const metric = data.metrics.find(m => m.name === name);
  if (!metric) return null;
  const value = metric.values[0];
  if (!value) return null;
  return map(value.value);
};

const buildGraph = (nodes) => {
  const data = { nodes: [], links: [] };

  nodes.forEach(node => {
    data.nodes.push({ id: node.id, title: node.id.slice(0, 6), data: node });
  });

  nodes.forEach(node => {
    node.connections.forEach(conn => {
      const source = data.nodes.find(n => n.id === node.id);
      const target = data.nodes.find(n => n.id === conn.target);
      data.links.push({ id: conn.id, source, target });
    });
  });

  return data;
};

const useDataGraph = () => {
  // const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(SIGNAL_STATUS, { pollInterval: 5 * 1000 }));

  const [dataGraph, setDataGraph] = useObjectMutator({ nodes: [], links: [] });

  useEffect(() => {
    if (!data) return;
    const { json: { nodes = [] } } = data.signal_status;

    const nextGraph = buildGraph(nodes);

    setDataGraph(nextGraph);
  }, [data && data.signal_status.json.updatedAt]);

  return dataGraph;
};

const SignalServers = () => {
  const data = useDataGraph();

  const classes = useCustomStyles();
  const ref = useRef(null);
  const size = useComponentSize(ref);
  const { width, height } = size;
  const grid = useGrid({ width, height });

  const layout = useMemo(() => new ForceLayout(), []);
  const nodeProjector = useMemo(() => new NodeProjector({
    node: {
      showLabels: true,
      propertyAdapter: (d) => {
        const webrtcPeersCount = d.data.signal.topics.reduce((prev, curr) => prev + curr.peers.length, 0);
        const memoryMetric = getMetric(d.data, 'process.memory.rss', v => v / 1024 / 1024);

        return {
          class: nodeColors[memoryMetric > 150 ? 2 : memoryMetric > 100 ? 1 : 0],
          radius: webrtcPeersCount > 20 ? 20 : 10
        };
      }
    }
  }), []);

  return (
    <Grid container spacing={3} direction='column' alignItems='stretch'>
      <Grid item xs ref={ref}>
        <Svg width={width} height={height - 30}>
          {data &&
            <Graph
              data={data}
              grid={grid}
              layout={layout}
              nodeProjector={nodeProjector}
              classes={{
                nodes: classes.nodes
              }}
            />}
        </Svg>
      </Grid>
      <Grid item xs>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Signal</TableCell>
                <TableCell align='right'>Packets sent</TableCell>
                <TableCell align='right'>Packets receive</TableCell>
                <TableCell align='right'>Requests error</TableCell>
                <TableCell align='right'>Process CPU (%)</TableCell>
                <TableCell align='right'>Process memory usage (MB)</TableCell>
                <TableCell align='right'>Process uptime (sec)</TableCell>
                <TableCell align='right'>Hostname</TableCell>
                <TableCell align='right'>OS free memory (MB)</TableCell>
                <TableCell align='right'>OS arch</TableCell>
                <TableCell align='right'>OS platform</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.nodes.map((node) => {
                return (
                  <TableRow key={node.id}>
                    <TableCell component='th' scope='row'>
                      {node.id}
                    </TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'moleculer.transporter.packets.sent.total')}</TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'moleculer.transporter.packets.received.total')}</TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'moleculer.request.error.total') || 0}</TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'os.cpu.utilization', v => Math.floor(v))}</TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'process.memory.rss', v => Math.floor(v / 1024 / 1024))}</TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'process.uptime', v => Math.floor(v))}</TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'os.hostname')}</TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'os.memory.free', v => Math.floor(v / 1024 / 1024))}</TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'os.arch')}</TableCell>
                    <TableCell align='right'>{getMetric(node.data, 'os.platform')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default SignalServers;
