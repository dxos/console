//
// Copyright 2020 DxOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import SIGNAL_LOG from '../../../gql/signal_log.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

import Log from '../../../components/Log';

const MAX_LINES = 1000;
const oldLines = [];

const SignalLog = () => {
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(SIGNAL_LOG, {
    pollInterval: config.api.intervalLog,
    variables: { first: oldLines.length === 0 }
  }));
  if (!data) {
    return null;
  }

  const newLines = JSON.parse(data.signal_log.json);
  oldLines.push(...newLines);
  if (oldLines.length > MAX_LINES) {
    oldLines.splice(0, oldLines.length - MAX_LINES);
  }

  return (
    <Log log={oldLines.slice(0)}/>
  );
};

export default SignalLog;
