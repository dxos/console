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
import IPFSStatus from './IPFSStatus';

const TAB_STATUS = 'status';
const TAB_LOG = 'log';
const TAB_SWARM_LOG = 'swarm';

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

const IPFS = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_STATUS);

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_STATUS} label='Status' />
            <Tab value={TAB_LOG} label='Log' />
            <Tab value={TAB_SWARM_LOG} label='Connection Log' />
          </Tabs>
        </Toolbar>
      }
    >
      <TabContext value={tab}>
        {tab === TAB_STATUS && (
          <div className={classes.panel}>
            <Paper className={classes.paper}>
              <IPFSStatus />
            </Paper>
          </div>
        )}

        {tab === TAB_LOG && (
          <div className={classes.panel}>
            <LogPoller service='ipfs' />
          </div>
        )}

        {tab === TAB_SWARM_LOG && (
          <div className={classes.panel}>
            <LogPoller service='ipfs-swarm-connect' />
          </div>
        )}
      </TabContext>
    </Panel>
  );
};

export default IPFS;
