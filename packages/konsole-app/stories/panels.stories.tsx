//
// Copyright 2021 DXOS.org
//

import faker from 'faker';
import React, { useEffect, useRef, useState } from 'react';

import { makeStyles, Paper } from '@material-ui/core';

import { IConfig, RecordPanel, ConfigPanel, ConfigContext, Log, RegistryContext, ILogMessage } from '../src';
import { MockDxnsApi } from '../src/testing';

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
    title: 'Test'
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

const useTestMessages = (delta = 0) => {
  const generateMessage = (ts: number, previous?: number): ILogMessage => ({
    timestamp: new Date(ts).toISOString(),
    delta: previous ? (ts - previous) : undefined,
    level: faker.random.arrayElement(['DEBUG', 'WARN', 'ERROR']),
    message: faker.lorem.sentences().replace(/\./g, '.\r\n')
  });

  const generateHistoricalMessages = (n: number, ts: number = Date.now()) => {
    let start = ts;
    const times = [...new Array(10)].map(() => {
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

  const [messages, setMessages] = useState(generateHistoricalMessages(10));
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
  const messages = useTestMessages(5000);

  return (
    <ConfigContext.Provider value={config}>
      <Paper className={classes.root}>
        <Log messages={messages}/>
      </Paper>
    </ConfigContext.Provider>
  );
};
