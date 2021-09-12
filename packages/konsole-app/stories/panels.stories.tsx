//
// Copyright 2021 DXOS.org
//

import faker from 'faker';
import React, { useEffect, useRef, useState } from 'react';

import { makeStyles, CssBaseline, MuiThemeProvider, Paper } from '@material-ui/core';

import {
  createCustomTheme,
  logLevels,
  IConfig,
  RecordPanel,
  ConfigPanel,
  ConfigContext,
  Log,
  MockDxnsApi,
  RegistryContext,
  ILogMessage
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
    height: '100vh'
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

export const Records = () => {
  const classes = useStyles();

  return (
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={MockDxnsApi}>
        <Paper className={classes.root}>
          <RecordPanel />
        </Paper>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  );
};

const useTestMessages = (initial = 100, delta = 0) => {
  const generateMessage = (ts: number, previous?: number): ILogMessage => ({
    timestamp: new Date(ts).toISOString(),
    delta: previous ? (ts - previous) : undefined,
    level: faker.random.arrayElement(logLevels),
    message: faker.lorem.sentences().split('.').filter(Boolean).join('.\n') + '.'
  });

  const generateHistoricalMessages = (n: number, ts: number = Date.now()) => {
    let start = ts;
    const times = [...new Array(n)].map(() => {
      const next = start - Math.abs(Math.random() * 12) * 3600 * 1000;
      start = next;
      return next;
    }).reverse();

    let last: ILogMessage | undefined;
    return times.map(ts => {
      last = generateMessage(ts, last ? new Date(last.timestamp).getTime() : undefined);
      return last;
    });
  };

  const [messages, setMessages] = useState(generateHistoricalMessages(initial));
  const messagesRef = useRef(messages);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    const trigger = () => {
      t = setTimeout(() => {
        messagesRef.current = [
          ...messagesRef.current,
          generateMessage(Date.now(), new Date(messagesRef.current[messagesRef.current.length - 1].timestamp).getTime())
        ];
        setMessages(messagesRef.current);
        trigger();
      }, faker.random.number(delta));
    };

    if (delta) {
      trigger();
    }

    return () => clearTimeout(t);
  }, []);

  return messagesRef.current;
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
