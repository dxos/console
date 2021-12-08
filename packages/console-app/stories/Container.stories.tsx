//
// Copyright 2021 DXOS.org
//

import { Box, Paper } from '@mui/material';
import debug from 'debug';
import faker from 'faker';
import React, { useState } from 'react';

import {
  IPanel,
  ConfigContext,
  Container,
  Sidebar,
} from '../src';
import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

faker.seed(123);

export default {
  title: 'Container'
};

const panels: IPanel[] = ['a', 'b', 'c'].map(name => {
  const text = faker.lorem.sentences();
  return {
    id: name,
    path: `/${name}`,
    label: name,
    component: () => <Box>{text}</Box>
  };
});

export const Primary = () => {
  const [panel, setPanel] = useState<string>(panels[0].id);
  const { component: Component } = panels.find(({ id }) => id === panel)!;

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
          <Paper sx={{ padding: 2 }}>
            <Component />
          </Paper>
        </Container>
      </RootContainer>
    </ConfigContext.Provider>
  );
};
