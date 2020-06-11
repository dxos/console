//
// Copyright 2020 DxOS.org
//

import { spawnSync } from 'child_process';

class LogCache {
  constructor (maxLines = 500) {
    // Sets in JS iterate in insertion order.
    this.buffer = new Set();
    this.maxLines = maxLines;
  }

  append (lines) {
    const added = [];
    for (const line of lines) {
      if (!this.buffer.has(line)) {
        this.buffer.add(line);
        added.push(line);
      }
    }

    if (this.buffer.size > this.maxLines) {
      this.buffer = new Set(Array.from(this.buffer).slice(parseInt(this.maxLines / 2)));
    }

    return added;
  }
}

const _caches = new Map();

const getLogCache = (name) => {
  let cache = _caches.get(name);
  if (!cache) {
    cache = new LogCache();
    _caches.set(name, cache);
  }
  return cache;
};

const getLogs = async (name, incremental = false, lines = 100) => {
  const command = 'wire';
  const args = ['service', 'logs', '--lines', lines, name];

  const child = spawnSync(command, args, { encoding: 'utf8' });
  const logLines = child.stdout.split(/\n/);
  const cache = getLogCache(name);
  const added = cache.append(logLines);

  return incremental ? added : Array.from(cache.buffer);
};

export const logResolvers = {
  Query: {
    wns_log: async (_, { incremental }) => {
      const lines = await getLogs('wns-lite', incremental);
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify({ incremental, lines })
      };
    },
    signal_log: async (_, { incremental }) => {
      const lines = await getLogs('signal', incremental);
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify({ incremental, lines })
      };
    },
    ipfs_log: async (_, { incremental }) => {
      const lines = await getLogs('ipfs', incremental);
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify({ incremental, lines })
      };
    },
    ipfs_swarm_log: async (_, { incremental }) => {
      const lines = await getLogs('ipfs-swarm-connect', incremental);
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify({ incremental, lines })
      };
    },
    app_log: async (_, { incremental }) => {
      const lines = await getLogs('app', incremental);
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify({ incremental, lines })
      };
    }
  }
};
