//
// Copyright 2021 DXOS.org
//

import { Box } from '@mui/material';
import React from 'react';

export const Fullscreen = ({ children }: { children: JSX.Element | JSX.Element[] }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      overflow: 'hidden'
    }}
  >
    {children}
  </Box>
);
