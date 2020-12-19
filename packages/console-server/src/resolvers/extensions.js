//
// Copyright 2020 DXOS.org
//

import childProcess from 'child_process';

// TODO(telackey): Make pluggable.

const ifBigDipper = () => {
  try {
    const result = childProcess.execSync('docker ps -f "ancestor=big-dipper_app" -q');
    if (result && result.toString()) {
      return {
        title: 'Block Explorer',
        url: 'http://%HOST%:3080/'
      };
    } else {
      return {
        title: 'Block Explorer',
        url: 'http://blockexplorer.kube.moon.dxos.network:3080/'
      };
    }
  } catch (e) {}
};

const ifRadicle = () => {
  try {
    const result = childProcess.execSync('docker ps -f "ancestor=dxos/radicle-seed-node" -q');
    if (result && result.toString()) {
      return {
        title: 'Radicle',
        url: '/radicle/'
      };
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

export const extensionResolvers = {
  Query: {
    extensions: async (_, __, { config }) => {
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify([
          ifBigDipper(),
          ifRadicle(),
          ifSentry()
        ].filter(x => x))
      };
    }
  }
};
