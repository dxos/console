//
// Copyright 2021 DXOS.org
//

import React from 'react';
import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';

import { JsonTreeView } from '@dxos/react-components';

import { Panel, Toolbar } from '../components';
import { useSignal } from '../hooks';

/**
 * Displays the status of the signaling servers.
 */
export const SignalingPanel = () => {
  const [signalInfo, refreshSignalInfo] = useSignal(true);

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size='small'
            aria-label='refresh'
            onClick={refreshSignalInfo}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}
    >
      {signalInfo && <JsonTreeView data={signalInfo} />}
    </Panel>
  );
};
