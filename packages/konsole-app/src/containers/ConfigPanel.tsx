//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Box } from '@mui/material';

import { useConfig } from '../hooks';

/**
 * Displays the config JSON object.
 */
export const ConfigPanel = () => {
  const config = useConfig();

  // TODO(burdon): Re-implement JsonTreeView.
  return (
    <Box
      sx={{
        overflow: 'scroll'
      }}
    >
      <pre>
        {JSON.stringify(config, undefined, 2)}
      </pre>
    </Box>
  );
};
