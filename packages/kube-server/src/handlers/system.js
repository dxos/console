//
// Copyright 2021 DXOS.org
//

import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

const KUBE_SERVICES_INFO_FILE = '/opt/kube/services.json';

const mergeByProperty = (target, source, prop) => {
  source.forEach(sourceElement => {
    const targetElement = target.find(targetElement => {
      return sourceElement[prop] === targetElement[prop];
    });
    targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
  });
};

export const getServiceInfo = async ({ usage = false }) => {
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
