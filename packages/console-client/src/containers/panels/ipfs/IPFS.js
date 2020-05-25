//
// Copyright 2020 DxOS.org
//

import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import IPFS_STATUS from '../../../../gql/ipfs_status.graphql';

import { useQueryStatusReducer } from '../../../hooks';

import Json from '../../../components/Json';
import Panel from '../../../components/Panel';
import Toolbar from '../../../components/Toolbar';

const IPFS = () => {
  const data = useQueryStatusReducer(useQuery(IPFS_STATUS));
  if (!data) {
    return null;
  }

  return (
    <Panel
      toolbar={
        <Toolbar />
      }
    >
      <Json data={JSON.parse(data.ipfs_status.json)} />
    </Panel>
  );
};

export default IPFS;
