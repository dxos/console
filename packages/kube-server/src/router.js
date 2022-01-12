//
// Copyright 2021 DXOS.org
//

import express from 'express';

import { getServiceInfo, getLogs, faucet } from './handlers';

export const getRouter = (config) => {
  const router = express.Router();

  router.post('/logs', async (req, res) => res.json(await getLogs(req.body)));

  router.all('/services', async (req, res) => res.json(await getServiceInfo(req.body)));

  router.post('/faucet', async (req, res) => res.json(await faucet(config, req.body)));

  return router;
};
