//
// Copyright 2020 DxOS
//

import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Mutation } from '@apollo/react-components';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';

import ControlButtons from '../../components/ControlButtons';
import Json from '../../components/Json';
import Log from '../../components/Log';
import Panel from '../../components/Panel';
import Toolbar from '../../components/Toolbar';

import { ConsoleContext, useQueryStatusReducer } from '../../hooks';

import WNS_STATUS from '../../../gql/wns_status.graphql';
import WNS_ACTION from '../../../gql/wns_action.graphql';

const types = [
  { key: null, label: 'ALL' },
  { key: 'wrn:xbox', label: 'XBox' },
  { key: 'wrn:resource', label: 'Resource' },
  { key: 'wrn:app', label: 'App' },
  { key: 'wrn:bot', label: 'Bot' },
  { key: 'wrn:type', label: 'Type' },
];

const TAB_RECORDS = 'records';
const TAB_LOG = 'log';
const TAB_EXPLORER = 'explorer';

const useStyles = makeStyles(() => ({
  expand: {
    flex: 1
  }
}));

const WNS = () => {
  const classes = useStyles();
  const { config } = useContext(ConsoleContext);
  const [type, setType] = useState(types[0].key);
  const [tab, setTab] = useState(TAB_RECORDS);
  const data = useQueryStatusReducer(useQuery(WNS_STATUS, { pollInterval: config.api.pollInterval }));
  if (!data) {
    return null;
  }

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value={TAB_RECORDS} label="Records"/>
            <Tab value={TAB_EXPLORER} label="Explorer"/>
            <Tab value={TAB_LOG} label="Log"/>
          </Tabs>

          {tab === TAB_RECORDS && (
            <ButtonGroup
              className={classes.buttons}
              disableRipple
              disableFocusRipple
              variant="outlined"
              color="primary"
              size="small"
              aria-label="text primary button group"
            >
              {types.map(t => (
                <Button
                  key={t.key}
                  className={t.key === type && classes.selected}
                  onClick={() => setType(t.key)}
                >
                  {t.label}
                </Button>
              ))}
            </ButtonGroup>
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
        <TabPanel value={TAB_RECORDS}>
          <Json data={JSON.parse(data.wns_status.json)} />
        </TabPanel>

        <TabPanel value={TAB_EXPLORER}>
        </TabPanel>

        <TabPanel value={TAB_LOG}>
          <Log />
        </TabPanel>
      </TabContext>
    </Panel>
  );
};

export default WNS;
