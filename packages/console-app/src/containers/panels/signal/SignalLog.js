//
// Copyright 2020 DxOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import SIGNAL_LOG from '../../../gql/signal_log.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

import Log from '../../../components/Log';

const SignalLog = () => {
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(SIGNAL_LOG, { pollInterval: config.api.intervalLog }));
  if (!data) {
    return null;
  }

  return (
    <Log log={data.signal_log.log} />
  );
};

export default SignalLog;
