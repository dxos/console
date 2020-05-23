//
// Copyright 2020 DxOS
//

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';

import Status from '../components/Status';

import config from '../../config.json';

const { port, path } = config;

// TODO(burdon): Error handling for server errors.
// TODO(burdon): Authentication:
// https://www.apollographql.com/docs/react/networking/authentication/

const client = new ApolloClient({
  uri: `http://localhost:${port}${path}`
});

const Main = () => {
  return (
    <ApolloProvider client={client}>
      <Status />
    </ApolloProvider>
  );
};

export default Main;
