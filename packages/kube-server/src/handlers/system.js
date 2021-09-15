//
// Copyright 2021 DXOS.org
//

import { spawnSync } from 'child_process';

export const getServiceInfo = async () => {
  const command = 'dx';
  const args = ['service', '--json'];

  const child = spawnSync(command, args, { encoding: 'utf8' });
  return JSON.parse(child.stdout);
};
