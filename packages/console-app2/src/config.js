//
// Copyright 2021 DXOS.org
//

import { Config, Dynamics, Envs, Defaults } from '@dxos/config';

console.log('>>>>>', Dynamics, Envs);

// Generated by webpack-version-file-plugin.
// eslint-disable-next-line import/no-unresolved
import buildInfo from '../dist/version.json';

/**
 * Constructs a global config based on the precendence of other configurations.
 * NOTE: We do not use environment variables.
 *
 * The order of precedence:
 * - Stored config (e.g., user configurable options).
 * - Build-target specific config (e.g., servers).
 * - App-specific defaults and constants.
 * - Build info (generated by webpack).
 *
 * TODO(burdon): Define global schema (across all apps/modules).
 * @returns {Object}
 */

export const loadConfig = async () => new Config(
  await Dynamics(),
  await Envs(),
  Defaults(),
  buildInfo
);
