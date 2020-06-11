//
// Copyright 2020 DxOS.org
//

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TabContext from '@material-ui/lab/TabContext';

import LogPoller from '../../../components/LogPoller';
import Panel from '../../../components/Panel';
import Toolbar from '../../../components/Toolbar';

import WNSRecords, { WNSRecordType } from './WNSRecords';
import WNSStatus from './WNSStatus';

const TAB_RECORDS = 'records';
const TAB_STATUS = 'status';
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

const WNS = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_RECORDS);
  const [type, setType] = useState();

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_RECORDS} label='Records' />
            <Tab value={TAB_STATUS} label='Status' />
            <Tab value={TAB_LOG} label='Log' />
          </Tabs>

          {tab === TAB_RECORDS && (
            <WNSRecordType type={type} onChanged={setType} />
          )}
        </Toolbar>
      }
    >
      <TabContext value={tab}>
        {tab === TAB_RECORDS && (
          <div className={classes.panel}>
            <WNSRecords type={type} />
          </div>
        )}

        {tab === TAB_STATUS && (
          <div className={classes.panel}>
            <Paper className={classes.paper}>
              <WNSStatus />
            </Paper>
          </div>
        )}

        {tab === TAB_LOG && (
          <div className={classes.panel}>
            <LogPoller service='wns-lite' />
          </div>
        )}
      </TabContext>
    </Panel>
  );
};

export default WNS;
