//
// Copyright 2020 DxOS
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import Json from '../components/Json';

import { ConsoleContext, useQueryStatusReducer } from '../hooks';

import QUERY from '../../gql/ipfs.graphql';

const IPFS = () => {
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(QUERY, { pollInterval: config.api.pollInterval }));
  if (!data) {
    return null;
  }

  // TODO(burdon): Return structured GraphQL.
  return (
    <Json data={{ ipfs: JSON.parse(data.ipfs.json) }} />
  );
};

export default IPFS;
