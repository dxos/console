//
// Copyright 2020 DXOS.org
//

import childProcess from 'child_process';

// TODO(telackey): Make pluggable.
const ifRadicle = () => {
  try {
    const result = childProcess.execSync('docker ps -f "ancestor=dxos/radicle-seed-node" -q');
    if (result) {
      return { title: 'Radicle', url: '/' };
    }
  } catch (e) {}
};

// TODO(telackey): Use the local Sentry.
const ifSentry = () => {
  return {
    title: 'Sentry',
    url: 'http://sentry.kube.dxos.network:9000/'
  };
};

export const addonResolvers = {
  Query: {
    addon_list: async (_, __, { config }) => {
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify([
          ifRadicle(),
          ifSentry()
        ].filter(x => x))
      };
    }
  }
};
