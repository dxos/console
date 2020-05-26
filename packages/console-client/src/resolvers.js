//
// Copyright 2020 DxOS.org
//

import debug from 'debug';

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl } from './util/config';

const log = debug('dxos:console:client:resolvers');

const timestamp = () => new Date().toUTCString();

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
          timestamp: timestamp(),

          // NOTE: Hack since this should be a string according to the schema.
          json: data
        };
      },

      wns_records: async (_, { type }) => {
        log('WNS records...');
        const data = await registry.queryRecords({ type });

        return {
          __typename: 'JSONResult',
          timestamp: timestamp(),

          // NOTE: Hack since this should be a string according to the schema.
          json: data
        };
      },

      wns_log: async () => {
        log('WNS log...');

        // TODO(burdon): Cache and merge previous state.
        const data = await registry.getLogs();

        return {
          __typename: 'JSONLog',
          timestamp: timestamp(),
          log: data
        };
      }
    }
  };
};
