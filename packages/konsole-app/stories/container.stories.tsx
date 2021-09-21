//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React, { useState } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams
} from 'react-router-dom';

import { Box } from '@mui/material';

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
    path: '/a',
    label: 'A',
    component: Box
  },
  {
    path: '/b',
    label: 'B',
    component: Box
  },
  {
    path: '/c',
    label: 'C',
    component: Box
  },
];

export const Primary = () => {
  const [panel, setPanel] = useState(panels[0].path);

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
          <Box
            sx={{
              padding: 2
            }}
          >
            Container: {panel}
          </Box>
        </Container>
      </RootContainer>
    </ConfigContext.Provider>
  );
};
