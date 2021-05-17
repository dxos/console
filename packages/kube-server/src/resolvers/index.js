//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import defaultsDeep from 'lodash.defaultsdeep';

import { botsResolvers } from './bots';
import { extensionResolvers } from './extensions';
import { ipfsResolvers } from './ipfs';
import { logResolvers } from './log';
import { systemResolvers } from './system';

// eslint-disable-next-line
const log = debug('dxos:kube:server:resolvers');

/**
 * Resolvers
 * https://www.apollographql.com/docs/graphql-tools/resolvers
 */
export const resolvers = defaultsDeep({

  // TODO(burdon): Auth.
  // https://www.apollographql.com/docs/apollo-server/data/errors/#codes

}, ipfsResolvers, systemResolvers, logResolvers, botsResolvers, extensionResolvers);
