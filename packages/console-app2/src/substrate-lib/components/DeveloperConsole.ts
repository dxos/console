// This component will simply add utility functions to your developer console.
//
// Copyright 2021 DXOS.org
//

import { useSubstrate } from '../';

export default function DeveloperConsole () {
  const { api, apiState, keyring, keyringState } = useSubstrate();
  if (apiState === 'READY') {
    window.api = api;
  }
  if (keyringState === 'READY') {
    window.keyring = keyring;
  }
  window.util = require('@polkadot/util');
  window.utilCrypto = require('@polkadot/util-crypto');

  return null;
}
