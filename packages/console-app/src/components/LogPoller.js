//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { ConsoleContext, useQueryStatusReducer } from '../hooks';

import LOGS from '../gql/logs.graphql';

import Log from './Log';

const MAX_LINES = 1000;
const _logBuffers = new Map();

const getLogBuffer = (name) => {
  let buffer = _logBuffers.get(name);
  if (!buffer) {
    buffer = [];
    _logBuffers.set(name, buffer);
  }
  return buffer;
};

const LogPoller = ({ service }) => {
  const { config } = useContext(ConsoleContext);
  const logBuffer = getLogBuffer(service);
  const { data } = useQueryStatusReducer(useQuery(LOGS, {
    pollInterval: config.api.intervalLog,
    variables: { service, incremental: logBuffer.length !== 0 }
  }));

  if (!data) {
    return null;
  }

  const { incremental, lines } = JSON.parse(data.logs.json);

  if (!incremental && lines.length) {
    logBuffer.length = 0;
  }

  logBuffer.push(...lines);
  if (logBuffer.length > MAX_LINES) {
    logBuffer.splice(0, logBuffer.length - MAX_LINES);
  }

  return (
    <Log log={logBuffer.slice(0)} />
  );
};

export default LogPoller;
