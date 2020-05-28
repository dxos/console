//
// Copyright 2020 DxOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import WNS_LOG from '../../../gql/wns_log.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

import Log from '../../../components/Log';

const WNSLog = () => {
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(WNS_LOG, { pollInterval: config.api.intervalLog }));
  if (!data) {
    return null;
  }

  return (
    <Log log={data.wns_log.log} />
  );
};

export default WNSLog;
