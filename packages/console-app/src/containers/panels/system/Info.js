//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import Json from '../../../components/Json';

import SYSTEM_STATUS from '../../../gql/system_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

const Info = () => {
  const { config } = useContext(ConsoleContext);
  const { data: systemResponse } = useQueryStatusReducer(useQuery(SYSTEM_STATUS, { pollInterval: config.api.intervalQuery }));
  if (!systemResponse) {
    return null;
  }

  const status = JSON.parse(systemResponse.system_status.json);

  return (
    <Json data={status} />
  );
};

export default Info;
