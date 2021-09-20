//
// Copyright 2021 DXOS.org
//

import { IService } from '../types';

export const TEST_SERVICES: IService[] = [
  {
    "name": 'app-server',
    "exec": "ghcr.io/dxos/app-server:dev",
    "status": "online",
    "ports": "",
    "cpu": 0,
    "memory": 228937728,
    "type": "container"
  },
  {
    "name": "bot-factory",
    "exec": "ghcr.io/dxos/bot-factory:dev",
    "status": "online",
    "ports": "",
    "cpu": 0,
    "memory": 74952704,
    "type": "container"
  },
  {
    "name": "console",
    "exec": "/usr/local/bin/dxos-console",
    "status": "online",
    "cpu": 0.2,
    "memory": 70930432,
    "type": "daemon"
  },
  {
    "name": "dxns",
    "exec": "ghcr.io/dxos/substrate-node:dev",
    "status": "online",
    "ports": "",
    "cpu": 0.37,
    "memory": 30273536,
    "type": "container"
  },
  {
    "name": "ipfs",
    "exec": "/usr/local/bin/ipfs",
    "status": "online",
    "cpu": 1,
    "memory": 83054592,
    "type": "daemon"
  },
  {
    "name": "ipfs-swarm-connect",
    "exec": "/usr/local/bin/node",
    "status": "online",
    "cpu": 0.1,
    "memory": 65187840,
    "type": "daemon"
  },
  {
    "name": "kube",
    "exec": "ghcr.io/dxos/kube:dev",
    "status": "online",
    "ports": "",
    "cpu": 0.76,
    "memory": 369750016,
    "type": "container"
  },
  {
    "name": "mdns",
    "exec": "/usr/local/bin/dxos-mdns",
    "status": "online",
    "cpu": 0,
    "memory": 41504768,
    "type": "daemon"
  },
  {
    "name": "signal",
    "exec": "ghcr.io/dxos/signal:dev",
    "status": "online",
    "ports": "",
    "cpu": 0.96,
    "memory": 111255552,
    "type": "container"
  },
  {
    "name": "wns-lite",
    "exec": "/usr/local/bin/wnsd-lite",
    "status": "online",
    "cpu": 0.3,
    "memory": 65089536,
    "type": "daemon"
  }
];

export const TEST_LOGS = [
  "2021-09-14T20:53:46.632038879Z   dxos:cli-app:server:auth Not authenticated. +1s\r",
  "2021-09-14T20:53:47.849691967Z   dxos:cli-app:server Not found in DXNS: dxos:application +31m\r",
  "2021-09-14T20:53:49.002739404Z   dxos:cli-app:server Not found in DXNS: dxos:application +1s\r",
  "2021-09-14T20:53:49.353874887Z   dxos:cli-app:server Not found in DXNS: dxos:application +351ms\r",
  "2021-09-14T20:53:49.791784679Z   dxos:cli-app:server Not found in DXNS: dxos:application +438ms\r",
  "2021-09-14T20:53:49.800143663Z   dxos:cli-app:server Found wrn://dxos/application/keyhole => QmceH1eecyyNPpzQEYPG3kYRXJMd42nGP1ANGRrrUwY6Q4 +8ms\r",
  "2021-09-14T20:53:49.800478810Z   dxos:cli-app:server Fetching: http://127.0.0.1:8888/ipfs/QmceH1eecyyNPpzQEYPG3kYRXJMd42nGP1ANGRrrUwY6Q4/ +1ms\r",
  "2021-09-14T20:53:50.670552105Z   dxos:cli-app:server Not found in DXNS: dxos:application +870ms\r",
  "2021-09-14T20:53:50.670929179Z   dxos:cli-app:server Cached wrn://dxos/application/keyhole => QmceH1eecyyNPpzQEYPG3kYRXJMd42nGP1ANGRrrUwY6Q4 +0ms\r",
  "2021-09-14T20:53:50.671280279Z   dxos:cli-app:server Fetching: http://127.0.0.1:8888/ipfs/QmceH1eecyyNPpzQEYPG3kYRXJMd42nGP1ANGRrrUwY6Q4/ +1ms\r",
  "2021-09-14T22:15:42.018673431Z   dxos:cli-app:server:auth Not authenticated. +1h\r",
  "2021-09-14T22:15:42.117632593Z   dxos:cli-app:server Not found in DXNS: dxos:application +1h\r",
];
