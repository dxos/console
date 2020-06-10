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
  console.error(data);
  if (!data) {
    return null;
  }

  return (
    <Log log={JSON.parse(data.wns_log.json)} />
  );
};

export default WNSLog;
