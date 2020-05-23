//
// Copyright 2020 DxOS
//

import debug from 'debug';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import QUERY_STATUS from '../../gql/status.graphql';

const log = debug('dxos:console:client:app');

const Status = () => {
  const { loading, error, data } = useQuery(QUERY_STATUS);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: ${error}</div>;
  }

  log(JSON.stringify(data));

  return (
    <pre>
      {JSON.stringify(data, undefined, 2)}
    </pre>
  );
};

export default Status;
