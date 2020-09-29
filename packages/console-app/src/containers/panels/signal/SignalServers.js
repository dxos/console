//
// Copyright 2020 DXOS.org
//

import React, { useContext, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import useComponentSize from '@rehooks/component-size';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

import SIGNAL_STATUS from '../../../gql/signal_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

import {
  SVG as Svg,
  useGrid,
  useObjectMutator
} from '@dxos/gem-core';

import {
  Graph,
  ForceLayout,
  NodeProjector,
  LinkProjector
} from '@dxos/gem-spore';

const useCustomStyles = makeStyles(() => ({
  nodes: {
    '& g.node.root circle': {
      fill: colors.blue[400]
    },
    '& g.node.adjacent circle': {
      fill: colors.red[400]
    },
    '& g.node.detach circle': {
      fill: colors.grey[400]
    },
    '& g.node text': {
      fontFamily: 'sans-serif',
      fontWeight: 100,
      fill: '#fff'
    },
    '& g.node.selected circle': {
      fill: colors.blue[100],
      stroke: colors.blue[500]
    }
  }
}));

const useLayout = (grid) => {
  return useMemo(() => new ForceLayout({
    center: {
      x: grid.center.x,
      y: grid.center.y
    },
    initializer: (d, center) => {
      const { type } = d;
      if (type === 'root') {
        return {
          fx: center.x,
          fy: center.y
        };
      }
    },
    force: {
      center: {
        strength: 0
      },
      radial: {
        radius: 200,
        strength: 0.5
      },
      links: {
        distance: 120
      },
      charge: {
        strength: -300
      },
      collide: {
        strength: 0.1
      }
    }
  }), []);
};

const buildGraph = (rootId, nodes) => {
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

    newGraph.nodes.push({ id: node.id, title: node.id.slice(0, 6), data: node, type });
  });

  nodes.forEach(node => {
    node.connections.forEach(conn => {
      newGraph.links.push({ id: conn.id, source: node.id, target: conn.target });
    });
  });

  return newGraph;
};

const useDataGraph = (response) => {
  const [dataGraph, setDataGraph, getDataGraph] = useObjectMutator({ updatedAt: 0, nodes: [], links: [] });

  useEffect(() => {
    if (!response) return;
    const { updatedAt, id: rootId, nodes = [] } = response.signal_status;

    if (getDataGraph().updatedAt >= updatedAt) return;

    const graph = buildGraph(rootId, nodes);
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
  const { row, open, setOpen } = props;

  const classes = useRowStyles();

  const system = row.kubeStatus.system

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(row.id)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {row.id}
        </TableCell>
        <TableCell align='right'>{row.signal.topics.reduce((prev, curr) => prev + curr.peers.length, 0)}</TableCell>
        <TableCell align='right'>{system?.version || '-'}</TableCell>
        <TableCell align='right'>{system?.nodejs?.version || '-'}</TableCell>
        <TableCell align='right'>{system?.memory?.used || '-'}</TableCell>
        <TableCell align='right'>{system?.memory?.total || '-'}</TableCell>
        <TableCell align='right'>{system?.time?.up ? moment(system?.time?.up).format('lll') : '-'}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
                Kube Services
              </Typography>
              <Table size='small' aria-label='services'>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.kubeStatus.services.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell component='th' scope='row'>
                        {service.name}
                      </TableCell>
                      <TableCell>{service.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const SignalServers = () => {
  const { config } = useContext(ConsoleContext);
  const response = useQueryStatusReducer(useQuery(SIGNAL_STATUS, { pollInterval: config.api.pollInterval, context: { api: 'signal' } }));

  const data = useDataGraph(response);

  const classes = useCustomStyles();
  const ref = useRef(null);
  const size = useComponentSize(ref);
  const width = size.width || 0;
  const height = size.height ? size.height - 30 : 0;
  const grid = useGrid({ width, height });

  const layout = useLayout(grid);

  const { nodeProjector, linkProjector } = useMemo(() => ({
    nodeProjector: new NodeProjector({
      node: {
        radius: 16,
        showLabels: true,
        propertyAdapter: ({ id, type }) => {
          return {
            class: type,
            radius: {
              root: 20,
              neighbors: 15,
              detach: 10
            }[type]
          };
        }
      }
    }),
    linkProjector: new LinkProjector({ nodeRadius: 16, showArrows: true })
  }), []);

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
    <Grid container spacing={3} direction='column' alignItems='stretch'>
      <Grid item xs ref={ref}>
        {width && height && <Svg width={width} height={height}>
          {data &&
            <Graph
              data={data}
              grid={grid}
              layout={layout}
              nodeProjector={nodeProjector}
              linkProjector={linkProjector}
              classes={{
                nodes: classes.nodes
              }}
            />}
        </Svg>}
      </Grid>
      <Grid item xs>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
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
};

export default SignalServers;
