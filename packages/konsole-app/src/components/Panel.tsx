//
// Copyright 2021 DXOS.org
//

import { Box, Divider, Paper } from '@mui/material';
import React from 'react';

interface PanelProps {
  children?: JSX.Element
  toolbar?: JSX.Element
}

export const Panel = ({ children, toolbar }: PanelProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden'
      }}
    >
      {toolbar}
      {toolbar && children && (
        <Divider />
      )}
      {children && (
        <Paper
          square
          elevation={1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden',
            margin: 1 // TODO(burdon): Remove padding and inner border on tables.
          }}
        >
          {children}
        </Paper>
      )}
    </Box>
  );
};
