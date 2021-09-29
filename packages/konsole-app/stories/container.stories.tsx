//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React, { useState } from 'react';

import { Box, Paper } from '@mui/material';

import {
  IPanel,
  ConfigContext,
  Container,
  Sidebar,
} from '../src';

import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'Container'
};

const panels: IPanel[] = [
  {
    id: 'a',
    path: '/a',
    label: 'A',
    component: Box
  },
  {
    id: 'b',
    path: '/b',
    label: 'B',
    component: Box
  },
  {
    id: 'c',
    path: '/c',
    label: 'C',
    component: Box
  },
];

export const Primary = () => {
  const [panel, setPanel] = useState(panels[0].id);

  return (
    <ConfigContext.Provider value={config}>
      <RootContainer config={config}>
        <Container
          sidebar={
            <Sidebar
              panels={panels}
              selected={panel}
              onSelect={panel => setPanel(panel)}
            />
          }
        >
          <Paper
            sx={{
              padding: 2
            }}
          >
            <Box
              sx={{
                padding: 2
              }}
            >
              Container: {panel}
            </Box>
          </Paper>
        </Container>
      </RootContainer>
    </ConfigContext.Provider>
  );
};
