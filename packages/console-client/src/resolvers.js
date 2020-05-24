//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { Registry } from '@wirelineio/registry-client';

const log = debug('dxos:console:client:resolvers');

//
// Resolvers
// https://www.apollographql.com/docs/tutorial/local-state/#local-resolvers
//

export const createResolvers = config => {
  // TODO(burdon): Get route if served from xbox.
  const { services: { wns: { server } } } = config;

  const registry = new Registry(server);

  return {
    Query: {
      wns: async () => {
        log('Querying WNS...');

        const status = await registry.getStatus();

        return {
          __typename: 'JSONResult',
          json: JSON.stringify(status)
        };
      }
    }
  };
};
