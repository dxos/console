//
// Copyright 2021 DXOS.org
//

import express from 'express';

import { getServiceInfo, runServiceAction, getLogs, faucet, matrix } from './handlers';

export const getRouter = (config) => {
  const router = express.Router();

  router.post('/logs', async (req, res) => res.json(await getLogs(req.body)));

  router.get('/services', async (req, res) => res.json(await getServiceInfo(req.query)));
  router.post('/services', async (req, res) => res.json(await runServiceAction(req.body)));

  router.post('/faucet', async (req, res) => res.json(await faucet(config, req.body)));

  router.post('/matrix', async (req, res) => res.json(await matrix(config, req.body)));

  return router;
};
