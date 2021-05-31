//
// Copyright 2021 DXOS.org
//

import { readFileSync, existsSync } from 'fs';
import yaml from 'js-yaml';

import { Config } from '@dxos/config';

import defaultConfig from '../config.yml'

export const getConfig = (configPath) => {
  if (!existsSync) {
    throw new Error('Configuration file does not exist. Please init default cli profile or provide proper path to config file.');
  }

  const profileConfig = yaml.safeLoad(readFileSync(configPath));
  const config = new Config(profileConfig, yaml.safeLoad(defaultConfig));

  console.log('>>>>>>>>>>>>', JSON.stringify(config.values, null, 4));

  return config;
};
