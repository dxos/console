// This component will simply add utility functions to your developer console.
//
// Copyright 2021 DXOS.org
//

import { useSubstrate } from '../';

export default function DeveloperConsole () {
  const { api, apiState, keyring, keyringState } = useSubstrate();
  const win: Record<string, any> = window;

  if (apiState === 'READY') {
    win.api = api;
  }
  if (keyringState === 'READY') {
    win.keyring = keyring;
  }
  win.util = require('@polkadot/util');
  win.utilCrypto = require('@polkadot/util-crypto');

  return null;
}
