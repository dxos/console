//
// Copyright 2020 DxOS
//

import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import QUERY_STATUS from '../gql/status.graphql';

const App = () => {
  const { loading, error, data } = useQuery(QUERY_STATUS);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: ${error}</div>;
  }

  return (
    <pre>
      {JSON.stringify(data, undefined, 2)}
    </pre>
  );
};

export default App;
