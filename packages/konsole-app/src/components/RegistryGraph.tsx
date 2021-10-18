//
// Copyright 2021 DXOS.org
//

import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useResizeAware from 'react-resize-aware';

import { SVG, convertTreeToGraph, createTree, useGrid, GraphType } from '@dxos/gem-core';
import { ForceLayout, Graph } from '@dxos/gem-spore';
import { Domain, Resource } from '@dxos/registry-client';

import { IRecord } from './RecordsTable';

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

  console.log({domains, records, resources, data})

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
        />
      </SVG>
    </Box>
  );
};
