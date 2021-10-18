//
// Copyright 2021 DXOS.org
//

import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useResizeAware from 'react-resize-aware';
import { colors } from '@mui/material';

import { SVG, convertTreeToGraph, createTree, useGrid, GraphType } from '@dxos/gem-core';
import { ForceLayout, Graph, NodeProjector } from '@dxos/gem-spore';
import { Domain, Resource } from '@dxos/registry-client';

import { IRecord } from './RecordsTable';
import { makeStyles } from '@mui/styles';

const nodeColors: (keyof typeof colors)[] = ['red', 'green', 'blue', 'yellow', 'orange', 'grey'];

const useStyles = makeStyles(() => ({
  nodes: nodeColors.reduce((map: any, color: string) => {
    map[`& g.node.${color} circle`] = {
      fill: (colors as any)[color][400],
      stroke: (colors as any)[color][700]
    };

    map[`& g.node.${color} text`] = {
      fontFamily: 'sans-serif',
      fontSize: 12,
      fill: colors['grey'][700]
    };

    return map;
  }, {})
}));

interface RegistryGraphProps {
  domains?: Domain[]
  records?: IRecord[],
  resources?: Resource[]
}

// https://github.com/dxos/gem/blob/main/packages/gem-spore/stories/graph.stories.tsx
export const RegistryGraph = ({ domains = [], records = [], resources = [] }: RegistryGraphProps) => {
  const [resizeListener, size] = useResizeAware();
  const grid = useGrid(size);
  const [data, setData] = useState<GraphType>({links: [], nodes: []});
  const [layout] = useState(() => new ForceLayout({ force: { links: { distance: 80 } } }));
  const classes = useStyles();

  console.log({domains, records, resources, data})

  const [{ nodeProjector }] = useState({
    nodeProjector: new NodeProjector({
      node: {
        showLabels: true,
        propertyAdapter: (node: any) => {
          return {
            class: 'grey'
          };
        }
      }
    })
  });

  useEffect(() => {
    const resourceNodes: GraphType['nodes'] = resources.map(resource => ({id: resource.id.toString(), title: resource.id.toString()}))
    const recordNodes: GraphType['nodes'] = records.map(record => ({id: record.cid.toString(), title: record.description ?? record.cid.toString()}))
    const nodes = [...resourceNodes, ...recordNodes]
    const links: GraphType['links'] = []
    setData({nodes, links})
  }, [domains, records, resources]);

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        position: 'relative'
      }}
    >
      {resizeListener}
      <SVG width={size.width || 0} height={size.height || 0}>
        <Graph
          grid={grid}
          data={data}
          layout={layout}
          nodeProjector={nodeProjector}
          classes={{
            nodes: classes.nodes
          }}
        />
      </SVG>
    </Box>
  );
};
