//
// Copyright 2020 DxOS.org
//

import debug from 'debug';

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl } from './util/config';

const log = debug('dxos:console:client:resolvers');

/**
 * Resolvers
 * https://www.apollographql.com/docs/tutorial/local-state/#local-resolvers
 * @param config
 */
export const createResolvers = config => {
  const endpoint = getServiceUrl(config, 'wns.server', { absolute: true });
  const registry = new Registry(endpoint);

  return {
    Query: {
      wns_status: async () => {
        log('WNS status...');
        const data = await registry.getStatus();

        return {
          __typename: 'JSONResult',
          json: data
        };
      },

      wns_records: async (_, { type }) => {
        log('WNS records...');
        const data = await registry.queryRecords({ type });

        return {
          __typename: 'JSONResult',
          json: data
        };
      },

      wns_log: async () => {
        log('WNS log...');

        // TODO(burdon): Use Registry API rather than from CLI?
        return {
          __typename: 'JSONLog',
          log: []
        };
      }
    }
  };
};
