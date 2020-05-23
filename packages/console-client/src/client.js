//
// Copyright 2020 DxOS
//

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import config from '../config.json';

const defaultServer = `${window.location.protocol}//${window.location.hostname}`;

const { server = defaultServer, port = 80, path = '/graphql' } = config;

// TODO(burdon): Authentication: send signed message to server (from client wallet).
// https://www.apollographql.com/docs/react/networking/authentication/

// https://www.apollographql.com/docs/link/
const link = createHttpLink({
  uri: `${server}:${port}${path}`
});

// https://www.apollographql.com/docs/react/api/apollo-client/
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});
