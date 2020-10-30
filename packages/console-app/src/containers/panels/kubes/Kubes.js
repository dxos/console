//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Panel from '../../../components/Panel';
import Toolbar from '../../../components/Toolbar';

import KubeRecords from './KubeRecords';

const TAB_RECORDS = 'records';

const useStyles = makeStyles(theme => ({
  root: {}
}));

const Kubes = () => {
  // eslint-disable-next-line
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_RECORDS);

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_RECORDS} label='Records' />
          </Tabs>
        </Toolbar>
      }
    >
      {tab === TAB_RECORDS && (
        <KubeRecords />
      )}
    </Panel>
  );
};

export default Kubes;
