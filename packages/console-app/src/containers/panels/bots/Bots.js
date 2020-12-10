//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Panel from '../../../components/Panel';
import Toolbar from '../../../components/Toolbar';

import BotRecords from './BotRecords';
import LogPoller from '../../../components/LogPoller';
import RunningBots from './RunningBots';

const TAB_RECORDS = 'records';
const TAB_LOG = 'log';
const TAB_DATA = 'running bots';

const useStyles = makeStyles(theme => ({
  root: {}
}));

const Bots = () => {
  // eslint-disable-next-line
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_RECORDS);

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_RECORDS} label='Records' />
            <Tab value={TAB_DATA} label='Running Bots' />
            <Tab value={TAB_LOG} label='Log' />
          </Tabs>
        </Toolbar>
      }
    >
      {tab === TAB_RECORDS && (
        <BotRecords />
      )}

      {tab === TAB_LOG && (
        <LogPoller service='bot-factory' />
      )}
      {tab === TAB_DATA && (
        <RunningBots />
      )}
    </Panel>
  );
};

export default Bots;
