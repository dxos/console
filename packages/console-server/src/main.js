//
// Copyright 2020 DxOS.org
//

import debug from 'debug';
import express from 'express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ApolloServer, gql } from 'apollo-server-express';
import { print } from 'graphql/language';

import SYSTEM_STATUS from '@dxos/console-client/gql/system_status.graphql';

import { createResolvers } from './resolvers';

import SCHEMA from './gql/api.graphql';

const config = yaml.safeLoad(
  fs.readFileSync(path.join(__dirname, '../../../node_modules/@dxos/console-client/config.yml')));

const log = debug('dxos:console:server');

debug.enable(config.system.debug);

//
// Express server.
//

const app = express();

//
// CORS
//

// import cors from 'cors'
// https://expressjs.com/en/resources/middleware/cors.html
// https://www.prisma.io/blog/enabling-cors-for-express-graphql-apollo-server-1ef999bfb38d
// app.use(cors({
//   origin: true,
//   credentials: true
// }));

//
// React app
//

const { app: { publicUrl } } = config;

// TODO(burdon): Load via WNS.
app.get(`${publicUrl}(/:filePath)?`, (req, res) => {
  const { filePath = 'index.html' } = req.params;
  const file = path.join(__dirname, '../../../node_modules/@dxos/console-client/dist/production', filePath);
  res.sendFile(file);
});

//
// Apollo Server
// https://www.apollographql.com/docs/apollo-server/api/apollo-server
//

const server = new ApolloServer({
  typeDefs: SCHEMA,

  resolvers: createResolvers(config),

  // https://www.apollographql.com/docs/apollo-server/testing/graphql-playground
  // https://github.com/prisma-labs/graphql-playground#usage
  // introspection: true,
  playground: {
    settings: {
      'editor.theme': 'light'
    },
    tabs: [
      {
        name: 'Status',
        endpoint: config.api.path,
        query: print(gql(SYSTEM_STATUS))
      }
    ]
  }
});

//
// Apollo middleware
// https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserverapplymiddleware
//

server.applyMiddleware({
  app,
  path: config.api.path
});

//
// Start server
//

const { api: { port } } = config;
app.listen({ port }, () => {
  log(`Running: http://localhost:${port}`);
});
