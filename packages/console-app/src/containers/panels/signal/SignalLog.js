//
// Copyright 2020 DxOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import SIGNAL_LOG from '../../../gql/signal_log.graphql';

import { ConsoleContext } from '../../../hooks';

import Log from '../../../components/Log';

const MAX_LINES = 1000;
const logBuffer = [];

const SignalLog = () => {
  const { config } = useContext(ConsoleContext);
  const { data, refetch, startPolling, stopPolling } = useQuery(SIGNAL_LOG, {
    variables: { incremental: false }
  });

  if (!data) {
    return null;
  }

  const { incremental, lines } = JSON.parse(data.signal_log.json);

  if (!incremental) {
    stopPolling();
    refetch({ incremental: true });
    startPolling(config.api.intervalLog);
  }

  logBuffer.push(...lines);
  if (logBuffer.length > MAX_LINES) {
    logBuffer.splice(0, logBuffer.length - MAX_LINES);
  }

  return (
    <Log log={logBuffer.slice(0)} />
  );
}
;

export default SignalLog;
