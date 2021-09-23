//
// Copyright 2021 DXOS.org
//

import { Config, Dynamics, Envs, Defaults } from '@dxos/config';

// Generated by webpack-version-file-plugin.
// eslint-disable-next-line import/no-unresolved
import buildInfo from '../dist/version.json';
import { IConfig } from './hooks';

export const loadConfig = async () => new Config(
  await Dynamics(),
  await Envs(),
  Defaults(),
  buildInfo
).values as IConfig; // TODO(burdon): Replace IConfig with ConfigSchema?
