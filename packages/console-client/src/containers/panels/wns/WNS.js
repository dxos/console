//
// Copyright 2020 DxOS.org
//

import React, { useState } from 'react';
import { Mutation } from '@apollo/react-components';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TabContext from '@material-ui/lab/TabContext';

import WNS_ACTION from '../../../../gql/wns_action.graphql';

import ControlButtons from '../../../components/ControlButtons';
import Panel from '../../../components/Panel';
import Toolbar from '../../../components/Toolbar';

import WNSLog from './WNSLog';
import WNSRecords, { WNSRecordType } from './WNSRecords';
import WNSStatus from './WNSStatus';

const TAB_RECORDS = 'explorer';
const TAB_STATUS = 'records';
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
            <Tab value={TAB_RECORDS} label="Records" />
            <Tab value={TAB_STATUS} label="Status" />
            <Tab value={TAB_LOG} label="Log" />
          </Tabs>

          {tab === TAB_RECORDS && (
            <WNSRecordType type={type} onChanged={setType} />
          )}

          <div className={classes.expand} />

          <Mutation mutation={WNS_ACTION}>
            {(action, { data }) => (
              <div>
                <ControlButtons
                  onStart={() => {
                    action({ variables: { command: 'start' } });
                  }}
                  onStop={() => {
                    action({ variables: { command: 'stop' } });
                  }}
                />
              </div>
            )}
          </Mutation>
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
            <WNSLog />
          </div>
        )}
      </TabContext>
    </Panel>
  );
};

export default WNS;
