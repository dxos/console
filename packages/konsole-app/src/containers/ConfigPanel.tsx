//
// Copyright 2021 DXOS.org
//

import { Paper } from '@mui/material';
import React from 'react';

import { JsonView, Panel } from '../components';
import { useConfig } from '../hooks';

/**
 * Displays the config JSON object.
 */
export const ConfigPanel = () => {
  const config = useConfig();

  // TODO(burdon): Re-implement JsonTreeView.
  return (
    <Panel>
      <Paper
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'scroll',
          padding: 1
        }}
      >
        <JsonView data={config} />
      </Paper>
    </Panel>
  );
};
