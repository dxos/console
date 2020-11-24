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

const TAB_STATUS = 'status';

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

const Sentry = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_STATUS);

  //TODO(wykoff): add query tab, add commonly used info tab
  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_STATUS} label='Link' />
          </Tabs>
        </Toolbar>
      }
    > 
      <TabContext value={tab}>
        {tab === TAB_STATUS && (
          <Paper className={classes.paper}>
            <a href="http://sentry.kube.dxos.network:9000/"><h3>Sentry</h3></a>
          </Paper>
        )}

      </TabContext>
    </Panel>
  );
};

export default Sentry;
