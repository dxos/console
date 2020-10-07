//
// Copyright 2020 DXOS.org
//

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { createResolvers } from './resolvers';
import { getServiceUrl } from './util/config';

const defaultServer = `${window.location.origin}`;

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
  const defaultLink = createHttpLink({
    uri: graphqlApi(config),

    // TODO(burdon): Authentication: send signed message to server (from client wallet).
    // https://www.apollographql.com/docs/react/networking/authentication/
    headers: {
      authorization: 'HALO_TOKEN'
    }
  });

  const serviceLinks = {
    signal: createHttpLink({
      uri: getServiceUrl(config, 'signal.api')
    })
  };

  // https://www.apollographql.com/docs/react/api/apollo-client/
  return new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    resolvers: createResolvers(config),
    link: ApolloLink.split(
      operation => operation.getContext().api && serviceLinks[operation.getContext().api],
      operation => serviceLinks[operation.getContext().api].request(operation),
      defaultLink
    )
  });
};
