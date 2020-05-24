//
// Copyright 2020 DxOS
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import Json from '../components/Json';

import { ConsoleContext, useQueryStatusReducer } from '../hooks';

import SYSTEM_STATUS from '../../gql/system_status.graphql';

const Status = () => {
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(SYSTEM_STATUS, { pollInterval: config.api.pollInterval }));
  if (!data) {
    return null;
  }

  return (
    <Json data={data.system_status} />
  );
};

export default Status;
