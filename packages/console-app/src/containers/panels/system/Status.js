//
// Copyright 2020 DXOS.org
//

import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TabContext from '@material-ui/lab/TabContext';

import Json from '../../../components/Json';

import SERVICE_STATUS from '../../../gql/service_status.graphql';
import SYSTEM_STATUS from '../../../gql/system_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

import Panel from '../../../components/Panel';
import Toolbar from '../../../components/Toolbar';

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
  const [tab, setTab] = useState(TAB_SERVICES);
  const systemResponse = useQueryStatusReducer(useQuery(SYSTEM_STATUS, { pollInterval: config.api.intervalQuery }));
  const serviceResponse = useQueryStatusReducer(useQuery(SERVICE_STATUS, { pollInterval: config.api.intervalQuery }));
  if (!systemResponse || !serviceResponse) {
    return null;
  }

  const status = JSON.parse(systemResponse.system_status.json);
  const services = JSON.parse(serviceResponse.service_status.json);

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
          <div className={classes.panel}>
            <Services services={services} />
          </div>
        )}

        {tab === TAB_INFO && (
          <div className={classes.panel}>
            <Json data={status} />
          </div>
        )}
      </TabContext>
    </Panel>
  );
};

export default Status;
