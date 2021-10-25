//
// Copyright 2021 DXOS.org
//

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import debug from 'debug';
import express from 'express';
import yargs from 'yargs';

import { getConfig } from './config';
import { router } from './router';

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

//
// CORS
//

// https://expressjs.com/en/resources/middleware/cors.html
// app.use(cors({
//   origin: true,
//   credentials: true
// }));

app.use(cors());

app.set('views', `${__dirname}/views`);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

// Endpoints for console-app.
app.use(express.json());
app.use(config.api.kubePath, router);

app.get('/', (req, res) => {
  res.redirect(config.api.path);
});

//
// Start server
//

const { api: { port } } = config;
app.listen({ port }, () => {
  log(`http://localhost:${port} is listening.`);
});
