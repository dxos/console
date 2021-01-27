//
// Copyright 2020 DXOS.org
//

import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import debug from 'debug';
import express from 'express';
import mustache from 'mustache-express';
import fs from 'fs';
import yaml from 'js-yaml';
import { ApolloServer, gql } from 'apollo-server-express';
import { print } from 'graphql/language';
import yargs from 'yargs';

// TODO(burdon): Use once published by @ashwinp.
// import { extensions as REGISTRY_EXTENSIONS, schema as REGISTRY_SCHEMA } from '@wirelineio/wns-schema';

import SYSTEM_STATUS from '@dxos/console-app/src/gql/system_status.graphql';

import { resolvers } from '../resolvers';

import API_SCHEMA from '../gql/api.graphql';

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

const configFile = argv.config || process.env.CONFIG_FILE;
if (!configFile) {
  yargs.showHelp();
  process.exit(1);
}

const config = yaml.safeLoad(fs.readFileSync(configFile));

const log = debug('dxos:console:server');

debug.enable(config.system.debug);

if (argv.verbose) {
  log(JSON.stringify(config, undefined, 2));
}

//
// Express server.
//

const { app: { publicUrl } } = config;

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'mustache');
app.engine('mustache', mustache());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

app.get('/', (req, res) => {
  res.redirect(publicUrl);
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
// React app
//

const bundles = [
  'runtime', 'vendor', 'material-ui', 'dxos', 'main'
];

app.use(`${publicUrl}/lib`, express.static('./dist/client'));

// TODO(burdon): Isn't this loaded via IPFS?
app.get(publicUrl, (req, res) => {
  res.render('console', {
    title: 'Console',
    container: 'root',
    config: JSON.stringify(config),
    scripts: bundles.map(bundle => ({ src: `${publicUrl}/lib/${bundle}.bundle.js` }))
  });
});

//
// Apollo Server and middleware
// https://www.apollographql.com/docs/apollo-server/api/apollo-server
// https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserverapplymiddleware
//

const server = new ApolloServer({
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
        endpoint: config.api.path,
        query: print(gql(SYSTEM_STATUS))
      }
    ]
  }
});

server.applyMiddleware({ app, path: config.api.path });

//
// Start server
//

const { api: { port } } = config;
app.listen({ port }, () => {
  log(`Running: http://localhost:${port}`);
});
