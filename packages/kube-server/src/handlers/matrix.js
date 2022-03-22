//
// Copyright 2021 DXOS.org
//

import { spawnSync } from 'child_process';

export const matrix = async (config, { pattern }) => {
  const script = process.env.MATRIX_SCRIPT ?? './bin/matrix-test.js';
  const args = [script, '--pattern', pattern];

  try {
    const child = spawnSync('node', args, { encoding: 'utf8' });
    const { status, output, stdout } = child;

    let result = {};
    if (status !== 0) {
      console.error(output);
    } else {
      result = JSON.parse(stdout);
    }

    console.log(result);

    return {
      status,
      result
    };
  } catch (err) {
    // TODO(burdon): Logging.
    console.err(err);
    return err;
  }
};
