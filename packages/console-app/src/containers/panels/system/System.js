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

import Info from './Info';
import Services from './Services';

const TAB_INFO = 'status';
const TAB_SERVICES = 'services';

const useStyles = makeStyles(() => ({
  expand: {
    flex: 1
  },

  panel: {
    display: 'flex',
    overflow: 'hidden',
    flex: 1
  }
}));

const System = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_SERVICES);

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_SERVICES} label='Services' />
            <Tab value={TAB_INFO} label='Info' />
          </Tabs>
        </Toolbar>
      }
    >
      <TabContext value={tab}>
        {tab === TAB_SERVICES && (
          <Paper className={classes.panel}>
            <Services />
          </Paper>
        )}

        {tab === TAB_INFO && (
          <Paper className={classes.panel}>
            <Info />
          </Paper>
        )}
      </TabContext>
    </Panel>
  );
};

export default System;
