//
// Copyright 2020 DxOS.org
//

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { createResolvers } from './resolvers';

const defaultServer = `${window.location.host}`;

export const graphqlApi = config => {
  const { api: { server = defaultServer, port = '', path = '/api' } } = config;
  let base = server;
  if (port) {
    base = `${base}:${port}`;
  }
  return `${base}${path}`;
};

/**
 * Craetes an Apollo client.
 * @param {Object} config
 * @returns {ApolloClient}
 */
export const clientFactory = config => {
  // https://www.apollographql.com/docs/link/
  const link = createHttpLink({
    uri: graphqlApi(config),

    // TODO(burdon): Authentication: send signed message to server (from client wallet).
    // https://www.apollographql.com/docs/react/networking/authentication/
    headers: {
      authorization: 'HALO_TOKEN'
    }
  });

  // https://www.apollographql.com/docs/react/api/apollo-client/
  return new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    resolvers: createResolvers(config),
    link
  });
};
