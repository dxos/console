//
// Copyright 2020 DxOS
//

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';

import Status from './Status';

import config from '../../config.json';
import Layout from '../components/Layout';
import ConsoleContextProvider from './ConsoleContextProvider';

const { server, port = 80, path } = config;

// TODO(burdon): Authentication:
// https://www.apollographql.com/docs/react/networking/authentication/

// TODO(burdon): Configure from server.
// TODO(burdon): Configure error handling for server errors.
const client = new ApolloClient({
  uri: `${server}:${port}${path}`
});

const Main = () => {
  return (
    <ApolloProvider client={client}>
      <ConsoleContextProvider>
        <Layout>
          <Status />
        </Layout>
      </ConsoleContextProvider>
    </ApolloProvider>
  );
};

export default Main;
