//
// Copyright 2020 DxOS
//

import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import Json from '../components/Json';

import { useQueryStatusReducer } from '../hooks';

import IPFS_STATUS from '../../gql/ipfs_status.graphql';

const IPFS = () => {
  const data = useQueryStatusReducer(useQuery(IPFS_STATUS));
  if (!data) {
    return null;
  }

  return (
    <Json data={JSON.parse(data.ipfs_status.json)} />
  );
};

export default IPFS;
