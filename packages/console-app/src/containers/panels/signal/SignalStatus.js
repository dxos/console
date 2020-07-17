//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import SIGNAL_STATUS from '../../../gql/signal_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

import Json from '../../../components/Json';

const SignalStatus = () => {
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(SIGNAL_STATUS, { pollInterval: config.api.intervalQuery }));
  if (!data) {
    return null;
  }

  return (
    <Json data={data.signal_status.json} />
  );
};

export default SignalStatus;
