//
// Copyright 2021 DXOS.org
//

import { Box, Toolbar as MuiToolbar } from '@mui/material';
import React from 'react';

interface PanelProps {
  children?: JSX.Element | JSX.Element[]
  toolbar?: JSX.Element
}

export const Toolbar = MuiToolbar;

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
      {children && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden',
            padding: 1,
            '& .monospace': {
              fontFamily: 'DM Mono, monospace'
            }
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};
