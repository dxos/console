//
// Copyright 2021 DXOS.org
//

import { spawnSync } from 'child_process';

const DEFAULT_AMOUNT = '1000000000000';

// TODO(burdon): Placeholder.
export const faucet = async (config, { account }) => {
  const adminMnemonic = config.system.mnemonic;
  if (!adminMnemonic) {
    return {};
  }

  const command = 'dx';
  const args = ['dxns', 'balance', 'increase', '--account', account, '--amount', DEFAULT_AMOUNT, '--mnemonic', adminMnemonic, '--json'];

  const child = spawnSync(command, args, { encoding: 'utf8' });

  try {
    const result = JSON.parse(child.stdout);
    return result;
  } catch (err) {
    return {};
  }
};
