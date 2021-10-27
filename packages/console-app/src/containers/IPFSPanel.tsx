//
// Copyright 2021 DXOS.org
//

import { TabContext, TabList } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import React from 'react';

import { IPFSStatus, IPFSTable, Panel } from '../components';

/**
 * Displays the status of the IPFS servers.
 */
export const IPFSPanel = () => {
  const [tab, setTab] = React.useState('1');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  return (
    <TabContext value={tab}>
      <Panel
        toolbar={
          <Box>
            <TabList onChange={handleTabChange}>
              <Tab label='Status' value='1' />
              <Tab label='Records' value='2' />
            </TabList>
          </Box>
        }>
          {tab === '1' ? <IPFSStatus /> : <> </>}
          {tab === '2' ? <IPFSTable /> : <> </>}
      </Panel>
    </TabContext>
  );
};
