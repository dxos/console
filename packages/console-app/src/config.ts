//
// Copyright 2021 DXOS.org
//

import { Config, Dynamics, Envs, Defaults } from '@dxos/config';

export const loadConfig = async () => new Config(
  await Dynamics(),
  await Envs(),
  Defaults()
);
