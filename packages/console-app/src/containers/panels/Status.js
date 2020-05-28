//
// Copyright 2020 DxOS.org
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import Json from '../../components/Json';

import SYSTEM_STATUS from '../../gql/system_status.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../hooks';

import Panel from '../../components/Panel';
import Toolbar from '../../components/Toolbar';

const Status = () => {
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(SYSTEM_STATUS, { pollInterval: config.api.intervalQuery }));
  if (!data) {
    return null;
  }

  return (
    <Panel
      toolbar={
        <Toolbar />
      }
    >
      <Json data={data.system_status} />
    </Panel>
  );
};

export default Status;
