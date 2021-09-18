//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { makeStyles, CssBaseline, MuiThemeProvider, Paper } from '@material-ui/core';

import { MockRegistryApi } from '@dxos/registry-api';

import {
  createCustomTheme,
  useTestMessages,
  IConfig,
  ConfigPanel,
  ConfigContext,
  FlexTable,
  Log,
  RecordPanel,
  RegistryContext
} from '../src';

// TODO(burdon): Module not found: Error: [CaseSensitivePathsPlugin]
// https://github.com/storybookjs/storybook/issues/7704

export default {
  title: 'Panels'
};

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden'
  }
}));

const config: IConfig = {
  app: {
    title: 'Test',
    theme: 'dark'
  },
  registry: {
    endpoint: ''
  },
  services: {
    dxns: {
      server: 'test-dxns-server'
    },
    app: {
      prefix: 'test-prefix',
      server: 'test-server'
    }
  },
  system: {
    debug: 'stories'
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

export const Table = () => {
  const classes = useStyles();
  const messages = useTestMessages(30);

  const columns = [
    {
      id: 'timestamp',
      label: 'ts'
    },
    {
      id: 'level'
    },
    {
      id: 'message'
    }
  ];

  // TODO(burdon): Roboto/DM fonts.
  return (
    <ConfigContext.Provider value={config}>
      <Paper className={classes.root}>
        <FlexTable
          columns={columns}
          rows={messages}
          cellRenderer={({ row, id }) => {
            if (id === 'timestamp') {
              return (
                <div style={{ whiteSpace: 'nowrap', fontFamily: 'monospace', color: 'darkGreen' }}>{row[id]}</div>
              );
            }
          }}
        />
      </Paper>
    </ConfigContext.Provider>
  );
};

export const Records = () => {
  const classes = useStyles();

  // TODO(burdon): MockRegistryApi should be configurable to generate data. Not passed in by class or global.
  return (
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={MockRegistryApi}>
        <MuiThemeProvider theme={createCustomTheme(config)}>
          <CssBaseline />
          <Paper className={classes.root}>
            <RecordPanel />
          </Paper>
        </MuiThemeProvider>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  );
};

export const Logs = () => {
  const classes = useStyles();
  const messages = useTestMessages(10, 5000);

  return (
    <ConfigContext.Provider value={config}>
      <MuiThemeProvider theme={createCustomTheme(config)}>
        <CssBaseline />
        <Paper className={classes.root}>
          <Log messages={messages}/>
        </Paper>
      </MuiThemeProvider>
    </ConfigContext.Provider>
  );
};
