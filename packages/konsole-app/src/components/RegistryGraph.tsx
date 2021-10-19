//
// Copyright 2021 DXOS.org
//

import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useResizeAware from 'react-resize-aware';
import { colors } from '@mui/material';

import { SVG, convertTreeToGraph, createTree, useGrid, GraphType, NodeType } from '@dxos/gem-core';
import { ForceLayout, Graph, LinkProjector, NodeProjector } from '@dxos/gem-spore';
import { Domain, Resource } from '@dxos/registry-client';

import { IRecord } from './RecordsTable';
import { makeStyles } from '@mui/styles';
import { IResourceRecord } from '.';

const nodeColors: (keyof typeof colors)[] = ['red', 'green', 'blue', 'yellow', 'orange', 'grey'];
type NodeKind = 'record' | 'resource' | 'domain'
type Node = NodeType & {kind: NodeKind}
const typeMap: Record<NodeKind, keyof typeof colors> = {
  record: 'blue',
  resource: 'orange',
  domain: 'green'
};

const nodeProjector = new NodeProjector({
  node: {
    showLabels: true,
    propertyAdapter: (node: Node) => {
      return {
        class: typeMap[node.kind] ?? 'grey'
      };
    }
  }
})
const linkProjector = new LinkProjector({ nodeRadius: 8, showArrows: true })

const useStyles = makeStyles(() => ({
  nodes: nodeColors.reduce((map: any, color: string) => {
    map[`& g.node.${color} circle`] = {
      fill: (colors as any)[color][400],
      stroke: (colors as any)[color][700]
    };

    map[`& g.node.${color} text`] = {
      fontFamily: 'sans-serif',
      fontSize: 12,
      fill: colors['grey'][200]
    };

    return map;
  }, {})
}));

interface RegistryGraphProps {
  domains?: Domain[]
  records?: IResourceRecord[] | IRecord[],
  resources?: Resource[]
}

// https://github.com/dxos/gem/blob/main/packages/gem-spore/stories/graph.stories.tsx
export const RegistryGraph = ({ domains = [], records = [], resources = [] }: RegistryGraphProps) => {
  const [resizeListener, size] = useResizeAware();
  const grid = useGrid(size);
  const [data, setData] = useState<GraphType>({links: [], nodes: []});
  const [layout] = useState(() => new ForceLayout({ force: { links: { distance: 80 } } }));
  const classes = useStyles();

  useEffect(() => {
    const resourceNodes: Node[] = resources.map(resource => ({id: resource.id.toString(), title: resource.id.toString(), kind: 'resource'}))
    const recordNodes: Node[] = records
      .map(record => ({id: record.cid.toString(), title: record.description ?? record.cid.toString(), kind: 'record' as const}))
      .filter((record, index, array) => array.indexOf(record) === index); // Only unique. The duplications comes from same records by versions or by tags.

    const domainNodes: Node[] = domains.map(domain => ({id: domain.name ?? domain.key.toString(), title: domain.name ?? domain.key.toString(), kind: 'domain'}))
    const nodes = [...resourceNodes, ...recordNodes, ...domainNodes]

    const domainResourceLinks: GraphType['links'] = resources
      .filter(resource => resource.id.domain !== undefined)
      .map(resource => ({id: `${resource.id.toString()}-${resource.id.domain}`, source: resource.id.toString(), target: resource.id.domain!}))

    const resourceVersionsLinks: GraphType['links'] = resources
      .flatMap(resource => Object.entries(resource.versions).map(
        entry => ({id: `${resource.id.toString()}-${entry[0]}-${entry[1]?.toString()!}`, source: resource.id.toString(), target: entry[1]?.toString()!})
      ))

    const resourceTagsLinks: GraphType['links'] = resources
      .flatMap(resource => Object.entries(resource.tags).map(
        entry => ({id: `${resource.id.toString()}-${entry[0]}-${entry[1]?.toString()!}`, source: resource.id.toString(), target: entry[1]?.toString()!})
      ))

    const links = [...domainResourceLinks, ...resourceVersionsLinks, ...resourceTagsLinks]
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
          linkProjector={linkProjector}
          classes={{
            nodes: classes.nodes
          }}
        />
      </SVG>
    </Box>
  );
};
