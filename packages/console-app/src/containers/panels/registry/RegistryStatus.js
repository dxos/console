//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import WNS_STATUS from '../../../gql/wns_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

import Json from '../../../components/Json';

const RegistryStatus = () => {
  const { config } = useContext(ConsoleContext);
  const { data } = useQueryStatusReducer(useQuery(WNS_STATUS, { pollInterval: config.api.intervalQuery }));
  if (!data) {
    return null;
  }

  return (
    <Json data={data.wns_status.json} />
  );
};

export default RegistryStatus;
