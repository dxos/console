//
// Copyright 2021 DXOS.org
//

import { Box } from '@mui/material';
import React from 'react';

import { Panel } from '../components';
import { useConfig } from '../hooks';

/**
 * Displays the config JSON object.
 */
export const ConfigPanel = () => {
  const config = useConfig();

  // TODO(burdon): Re-implement JsonTreeView.
  return (
    <Panel>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'scroll',
          margin: 1,
          '& pre': {
            margin: 0
          }
        }}
      >
        <pre>
          {JSON.stringify(config, undefined, 2)}
        </pre>
      </Box>
    </Panel>
  );
};
