//
// Copyright 2020 DxOS
//

import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useQueryStatusReducer } from '../hooks';

import QUERY_STATUS from '../../gql/status.graphql';

const Status = () => {
  const data = useQueryStatusReducer(useQuery(QUERY_STATUS, { pollInterval: 5000 }));
  if (!data) {
    return null;
  }

  return (
    <pre>
      {JSON.stringify(data, undefined, 2)}
    </pre>
  );
};

export default Status;
