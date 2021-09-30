//
// Copyright 2021 DXOS.org
//

import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useResizeAware from 'react-resize-aware';

import { SVG, convertTreeToGraph, createTree, useGrid } from '@dxos/gem-core';
import { ForceLayout, Graph } from '@dxos/gem-spore';
import { DomainInfo } from '@dxos/registry-api';

import { IRecord } from './RecordsTable';

interface RecordsGraphProps {
  domains?: DomainInfo[]
  records?: IRecord[]
}

// https://github.com/dxos/gem/blob/main/packages/gem-spore/stories/graph.stories.tsx
export const RecordsGraph = ({ domains = [], records = [] }: RecordsGraphProps) => {
  const [resizeListener, size] = useResizeAware();
  const grid = useGrid(size);
  const [data] = useState(convertTreeToGraph(createTree({ minDepth: 1, maxDepth: 3 })));
  const [layout] = useState(() => new ForceLayout({ force: { links: { distance: 80 } } }));
  useEffect(() => {
    // TODO(burdon): Generate graph.
  }, [domains, records]);

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
