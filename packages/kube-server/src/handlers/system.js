//
// Copyright 2022 DXOS.org
//

import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import NodeCache from 'node-cache';

import { Lock } from '@dxos/async';

const CACHE_TTL = 10;

const FAILED = 'failed';
const SUCCESS = 'success';

const KUBE_SERVICES_INFO_FILE = '/opt/kube/services.json';

// TODO(egorgripasov): Support start/stop actions.
const ALLOWED_ACTIONS = ['restart'];

const _cache = new NodeCache({ stdTTL: CACHE_TTL, useClones: false });
const lock = new Lock();

const mergeByProperty = (target, source, prop) => {
  source.forEach(sourceElement => {
    const targetElement = target.find(targetElement => {
      return sourceElement[prop] === targetElement[prop];
    });
    targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
  });
};

const getServices = (usage) => {
  const command = 'dx';
  const args = ['service', '--json', '--usage', usage];

  const child = spawnSync(command, args, { encoding: 'utf8' });
  const runningServices = JSON.parse(child.stdout);

  let servicesInfo = [];
  if (existsSync(KUBE_SERVICES_INFO_FILE)) {
    servicesInfo = JSON.parse(readFileSync(KUBE_SERVICES_INFO_FILE, 'utf8'));
  }

  mergeByProperty(runningServices, servicesInfo, 'name');
  return runningServices;
};

export const getServiceInfo = async ({ usage = false, cached = true }) => {
  const cacheKey = `usage-${usage}`;
  const cachedServices = cached && _cache.get(cacheKey);
  if (cachedServices) {
    return cachedServices;
  }

  const services = await lock.executeSynchronized(async () => getServices(usage));
  cached && _cache.set(cacheKey, services);

  return services;
};

export const runServiceAction = async ({ action, service }) => {
  const command = 'dx';
  const args = ['service', action, service];

  if (!ALLOWED_ACTIONS.includes(action)) {
    return { status: FAILED, err: `Action ${action} is not supported.` };
  }

  const child = spawnSync(command, args, { encoding: 'utf8' });

  return { status: child.stderr ? FAILED : SUCCESS, err: child.stderr };
};
