//
// Copyright 2021 DXOS.org
//

import { Box } from '@mui/material';
import debug from 'debug';
import React, { useState } from 'react';

import { SearchBar } from '../src';
import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'Search'
};

export const Primary = () => {
  const [value, setValue] = useState<string | undefined>();

  return (
    <RootContainer config={config}>
      <Box
        sx={{
          width: 350,
          padding: 2
        }}
      >
        <SearchBar
          placeholder='Search records'
          onSearch={setValue}
          delay={500}
        />
        <Box>{value}</Box>
      </Box>
    </RootContainer>
  );
};
