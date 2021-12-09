//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { OpenInNew as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';

import { Panel, Toolbar } from '../components';

// TODO(burdon): Query the chain https://github.com/dxos/console/issues/138

/**
 * DXNS blockchain.
 */
export const DXNSPanel = () => {
  return (
    <Panel
      toolbar={(
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size='small'
            aria-label='refresh'
            onClick={() => {}}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}
    >
    </Panel>
  );
};
