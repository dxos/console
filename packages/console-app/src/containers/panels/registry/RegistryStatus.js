//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import REGISTRY_STATUS from '../../../gql/registry_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

import Json from '../../../components/Json';

const RegistryStatus = () => {
  const { config } = useContext(ConsoleContext);
  const { data } = useQueryStatusReducer(useQuery(REGISTRY_STATUS, { pollInterval: config.api.intervalQuery }));
  if (!data) {
    return null;
  }

  return (
    <Json data={data.registry_status.json} />
  );
};

export default RegistryStatus;
