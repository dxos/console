//
// Copyright 2020 DxOS.org
//

import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TabContext from '@material-ui/lab/TabContext';

import Json from '../../components/Json';

import SYSTEM_STATUS from '../../gql/system_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../hooks';

import Panel from '../../components/Panel';
import Toolbar from '../../components/Toolbar';

const TAB_SYSTEM = 'system';
const TAB_SERVICES = 'services';

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

const Status = () => {
  const classes = useStyles();
  const { config } = useContext(ConsoleContext);
  const [tab, setTab] = useState(TAB_SYSTEM);
  const systemResponse = useQueryStatusReducer(useQuery(SYSTEM_STATUS, { pollInterval: config.api.intervalQuery }));
  if (!systemResponse) {
    return null;
  }

  const data = JSON.parse(systemResponse.system_status.json);

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_SYSTEM} label='System'/>
            <Tab value={TAB_SERVICES} label='Services'/>
          </Tabs>
        </Toolbar>
      }
    >
      <TabContext value={tab}>
        {tab === TAB_SYSTEM && (
          <div className={classes.panel}>
            <Json data={data}/>
          </div>
        )}

        {tab === TAB_SERVICES && (
          <div className={classes.panel}>
          </div>
        )}
      </TabContext>
    </Panel>
  );
};

export default Status;
