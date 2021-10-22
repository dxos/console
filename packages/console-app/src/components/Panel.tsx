//
// Copyright 2021 DXOS.org
//

import { Box, Toolbar as MuiToolbar } from '@mui/material';
import React from 'react';

interface PanelProps {
  children?: JSX.Element | JSX.Element[]
  toolbar?: JSX.Element
  scroll?: boolean
}

export const Toolbar = MuiToolbar;

export const Panel = ({ children, toolbar, scroll = false }: PanelProps) => {
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
            overflow: scroll ? 'scroll' : 'hidden',
            padding: 1
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};
