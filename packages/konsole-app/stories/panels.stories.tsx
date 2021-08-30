//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { makeStyles, Paper } from '@material-ui/core';

import { IConfig, RecordPanel, ConfigPanel, ConfigContext, RegistryContext } from '../src';
import { MockRegistryClient } from '../src/testing';

// TODO(burdon): Module not found: Error: [CaseSensitivePathsPlugin]
// https://github.com/storybookjs/storybook/issues/7704

export default {
  title: 'Panels'
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  }
}));

const config: IConfig = {
  app: {
    title: 'Test'
  },
  registry: {
    endpoint: ''
  }
};

export const Config = () => {
  const classes = useStyles();

  return (
    <ConfigContext.Provider value={config}>
      <Paper className={classes.root}>
        <ConfigPanel />
      </Paper>
    </ConfigContext.Provider>
  );
};

export const Records = () => {
  const classes = useStyles();

  return (
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={new MockRegistryClient()}>
        <Paper className={classes.root}>
          <RecordPanel />
        </Paper>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  );
};
