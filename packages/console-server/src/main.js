//
// Copyright 2020 DxOS
//

import debug from 'debug';
import express from 'express';
import path from 'path';
import { ApolloServer, gql } from 'apollo-server-express';
import { print } from 'graphql/language';

import QUERY_STATUS from '@dxos/console-client/gql/status.graphql';
import config from '@dxos/console-client/config.json';

import { resolvers } from './resolvers';

import SCHEMA from './gql/api.graphql';

const log = debug('dxos:console:server');

// TODO(burdon): Config.
debug.enable('dxos:console:*');

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

const { publicUrl } = config;

app.get(`${publicUrl}(/:filePath)?`, (req, res) => {
  const { filePath = 'index.html' } = req.params;
  const file = path.join(__dirname, '../../../node_modules/@dxos/console-client/dist/production', filePath);
  console.log(__dirname, file);
  res.sendFile(file);
});

//
// Apollo Server
// https://www.apollographql.com/docs/apollo-server/api/apollo-server
//

const server = new ApolloServer({
  typeDefs: SCHEMA,
  resolvers,

  // https://www.apollographql.com/docs/apollo-server/testing/graphql-playground
  // https://github.com/prisma-labs/graphql-playground#usage
  // introspection: true,
  playground: {
    settings: {
      'editor.theme': 'light'
    },
    tabs: [
      {
        endpoint: config.path,
        query: print(gql(QUERY_STATUS))
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
  path: config.path
});

//
// Start server
//

app.listen({ port: config.port }, () => {
  log(`Running: http://localhost:${config.port}`);
});
