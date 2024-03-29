//
// Copyright 2021 DXOS.org
//

import express from 'express';

import { getServiceInfo, runServiceAction, getLogs, faucet } from './handlers';

export const getRouter = (config) => {
  const router = express.Router();

  router.post('/logs', async (req, res) => res.json(await getLogs(req.body)));

  router.post('/services', async (req, res) => res.json(await runServiceAction(req.body)));
  router.get('/services', async (req, res) => res.json(await getServiceInfo(req.query)));

  // TODO(burdon): Move to separate service?
  router.post('/faucet', async (req, res) => res.json(await faucet(config, req.body)));

  return router;
};
