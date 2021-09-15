//
// Copyright 2020 DXOS.org
//

import { ApolloServer /*, gql */ } from 'apollo-server-express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import debug from 'debug';
import express from 'express';
// import { print } from 'graphql/language';
import yargs from 'yargs';

// TODO(burdon): Factor out GraphQL definitions.
// import SYSTEM_STATUS_QUERY from '@dxos/console-app/src/gql/system_status.graphql';

import { getConfig } from './config';
import { resolvers } from './resolvers';
import { router } from './router';
import API_SCHEMA from './gql/api.graphql';

const argv = yargs
  .option('config', {
    alias: 'c',
    description: 'Config file',
    type: 'string'
  })
  .option('verbose', {
    alias: 'v',
    description: 'Verbse info',
    type: 'boolean'
  })
  .help()
  .alias('help', 'h')
  .argv;

const config = getConfig(argv.config || process.env.CONFIG_FILE).values;

debug.enable(config.system.debug);
const log = debug('dxos:kube:server');

if (argv.verbose) {
  log(JSON.stringify(config, undefined, 2));
}

//
// Express server.
//

const app = express();

app.set('views', `${__dirname}/views`);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

// Endpoints for konsole-app.
app.use(express.json());
app.use(config.api.kubePath, router);

app.get('/', (req, res) => {
  res.redirect(config.api.path);
});

//
// CORS
//

// import cors from 'cors'
// https://expressjs.com/en/resources/middleware/cors.html
// https://www.prisma.io/blog/enabling-cors-for-express-graphql-apollo-server-1ef999bfb38d
app.use(cors({
  origin: true,
  credentials: true
}));

//
// Apollo Server and middleware
// https://www.apollographql.com/docs/apollo-server/api/apollo-server
// https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserverapplymiddleware
//

const apolloServer = new ApolloServer({
  typeDefs: [
    API_SCHEMA
  ],

  // https://www.apollographql.com/docs/graphql-tools/resolvers
  resolvers,

  // https://www.apollographql.com/docs/apollo-server/data/resolvers/#the-context-argument
  context: ({ req }) => ({
    config,

    // TODO(burdon): Auth.
    authToken: req.headers.authorization
  }),

  // TODO(burdon): Config option (security?)
  // https://www.apollographql.com/docs/apollo-server/testing/graphql-playground
  // https://github.com/prisma-labs/graphql-playground#usage
  // introspection: true,
  playground: {
    settings: {
      'editor.theme': config.app.theme
    },
    tabs: [
      {
        name: 'Status',
        endpoint: config.api.path
        // query: print(gql(SYSTEM_STATUS_QUERY))
      }
    ]
  }
});

apolloServer.applyMiddleware({
  app,
  path: config.api.path
});

//
// Start server
//

const { api: { port } } = config;
app.listen({ port }, () => {
  log(`Open the GraphQL playground: http://localhost:${port}${config.api.path}`);
});
