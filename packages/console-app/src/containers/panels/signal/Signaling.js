//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TabContext from '@material-ui/lab/TabContext';

import Panel from '../../../components/Panel';
import Toolbar from '../../../components/Toolbar';
import LogPoller from '../../../components/LogPoller';

import SignalChannels from './SignalChannels';
import SignalServers from './SignalServers';

const TAB_NETWORK = 'servers';
const TAB_CHANNELS = 'channels';
const TAB_LOG = 'log';

const useStyles = makeStyles(() => ({
  expand: {
    flex: 1
  },

  panel: {
    display: 'flex',
    overflow: 'hidden',
    flex: 1
  },

  paper: {
    display: 'flex',
    overflow: 'hidden',
    flex: 1
  }
}));

const Signal = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_NETWORK);

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_NETWORK} label='Network' />
            <Tab value={TAB_CHANNELS} label='Channels' />
            <Tab value={TAB_LOG} label='Log' />
          </Tabs>
        </Toolbar>
      }
    >
      <TabContext value={tab}>
        {tab === TAB_NETWORK && (
          <div className={classes.panel}>
            <Paper className={classes.paper}>
              <SignalServers />
            </Paper>
          </div>
        )}

        {tab === TAB_CHANNELS && (
          <div className={classes.panel}>
            <Paper className={classes.paper}>
              <SignalChannels />
            </Paper>
          </div>
        )}

        {tab === TAB_LOG && (
          <div className={classes.panel}>
            <LogPoller service='signal' />
          </div>
        )}
      </TabContext>
    </Panel>
  );
};

export default Signal;
