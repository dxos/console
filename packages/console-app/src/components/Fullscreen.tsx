//
// Copyright 2021 DXOS.org
//

import { styled } from '@mui/material/styles';

export const Fullscreen = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'hidden'
}));
