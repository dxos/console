//
// Copyright 2020 DxOS
//

import debug from 'debug';
import express from 'express';
import path from 'path';
import { ApolloServer, gql } from 'apollo-server-express';
import { print } from 'graphql/language';

import SCHEMA from './gql/api.graphql';
import QUERY_STATUS from './gql/status.graphql';

import config from '../config.json';
import { version } from '../package.json';

const log = debug('c2:src');
debug.enable('c2:*');

// Resolver
const resolvers = {
  Query: {
    status: () => ({
      version
    })
  }
};

// Server
const app = express();

// CORS
// import cors from 'cors'
// https://expressjs.com/en/resources/middleware/cors.html
// https://www.prisma.io/blog/enabling-cors-for-express-graphql-apollo-server-1ef999bfb38d
// app.use(cors({
//   origin: true,
//   credentials: true
// }));

// React app
// TODO(burdon): Create HTML file.
// TODO(burdon): Load JS.
app.get('/app', (req,res) =>{
  res.sendFile(path.join(__dirname + '/../../../node_modules/@dxos/console-client/dist/es/main.js'));
});

// https://www.apollographql.com/docs/apollo-server/api/apollo-server
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

// https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserverapplymiddleware
server.applyMiddleware({
  app,
  path: config.path
});

app.listen({ port: config.port }, () => {
  log(`Running: http://localhost:${config.port}`);
});
