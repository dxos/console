//
// Copyright 2020 DxOS.org
//

import debug from 'debug';

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl } from './util/config';

const log = debug('dxos:console:client:resolvers');

const timestamp = () => new Date().toUTCString();

const MAX_LOG_LENGTH = 200;

/**
 * Resolvers
 * https://www.apollographql.com/docs/tutorial/local-state/#local-resolvers
 * @param config
 */
export const createResolvers = config => {
  const endpoint = getServiceUrl(config, 'wns.server', { absolute: true });
  const registry = new Registry(endpoint);

  // TODO(burdon): Errors swallowed!

  // Oldest to latest.
  let cachedLog = [];

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

        const data = await registry.getLogs();

        // TODO(burdon): Bug returns blank line at end.
        const filtered = data.map(line => line).filter(Boolean);

        // Cache and merge previous state.
        let i = filtered.findIndex(line => line === cachedLog[cachedLog.length - 1]);
        if (i === -1) {
          cachedLog = filtered;
        } else {
          i++;
          for (; i < filtered.length - 1; i++) {
            cachedLog.push(filtered[i]);
          }

          // Trim.
          cachedLog.splice(0, cachedLog.length - MAX_LOG_LENGTH);
        }

        return {
          __typename: 'JSONLog',
          timestamp: timestamp(),
          log: [...cachedLog].reverse()
        };
      }
    }
  };
};