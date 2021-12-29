//
// Copyright 2021 DXOS.org
//

import { Config, ConfigV1Object, Dynamics, Envs, Defaults } from '@dxos/config';

export const loadConfig = async () => new Config<ConfigV1Object>(
  await Dynamics(),
  await Envs(),
  Defaults()
).values as ConfigV1Object;
