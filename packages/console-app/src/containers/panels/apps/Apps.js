//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Panel from '../../../components/Panel';
import Toolbar from '../../../components/Toolbar';

import AppRecords from './AppRecords';
import LogPoller from '../../../components/LogPoller';

const TAB_RECORDS = 'records';
const TAB_LOG = 'log';

const useStyles = makeStyles(theme => ({
  root: {}
}));

const Apps = () => {
  // eslint-disable-next-line
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_RECORDS);

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_RECORDS} label='Records' />
            <Tab value={TAB_LOG} label='Log' />
          </Tabs>
        </Toolbar>
      }
    >
      {tab === TAB_RECORDS && (
        <AppRecords />
      )}

      {tab === TAB_LOG && (
        <LogPoller service='app-server' />
      )}
    </Panel>
  );
};

export default Apps;
