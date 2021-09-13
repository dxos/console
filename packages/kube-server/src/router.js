//
// Copyright 2021 DXOS.org
//

import express from 'express';

import { getServiceInfo, getLogs } from './handlers';

export const router = express.Router();

router.post('/logs', async (req, res) => res.json(await getLogs(req.body)));

router.get('/services', async (req, res) => res.json(await getServiceInfo(req.body)));
