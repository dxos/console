//
// Copyright 2020 DXOS.org
//

import childProcess from 'child_process';

// TODO(telackey): Make pluggable.

const ifBlockExplorer = () => {
  try {
    const result = childProcess.execSync('docker ps -f "ancestor=big-dipper_app" -q');
    return {
      title: 'Block Explorer',
      url: (result && result.toString()) ? 'http://%HOST%:3080/' : 'http://blockexplorer.moon.dxos.network:3080/'
    };
  } catch (err) {
    console.error(err);
  }
};

const ifRadicle = () => {
  return {
    title: 'Radicle',
    url: 'http://radicle.moon.dxos.network/'
  }
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
    extensions: async () => {
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify([
          ifBlockExplorer(),
          ifRadicle(),
          ifSentry()
        ].filter(x => x))
      };
    }
  }
};
