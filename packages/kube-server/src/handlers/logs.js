//
// Copyright 2021 DXOS.org
//

import { spawnSync } from 'child_process';
import NodeCache from 'node-cache';

const CACHE_TTL = 86400;

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

const _caches = new NodeCache({ stdTTL: CACHE_TTL, useClones: false });

const getLogCache = (name) => {
  let cache = _caches.get(name);
  if (!cache) {
    cache = new LogCache();
    _caches.set(name, cache);
  }
  return cache;
};

export const getLogs = async ({ name, incremental = false, lines = 500, uniqueId }) => {
  const command = 'dx';
  const args = ['service', 'logs', name, '--lines', lines];

  const child = spawnSync(command, args, { encoding: 'utf8' });
  const logLines = child.stdout.split(/\n/).filter(line => line).map(line => line.trim());
  const cache = getLogCache(`${name}-${uniqueId}`);
  const added = cache.append(logLines);

  if (incremental) {
    return added;
  } else {
    return Array.from(cache.buffer).slice(-1 * lines);
  }
};
