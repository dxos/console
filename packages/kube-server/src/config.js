//
// Copyright 2021 DXOS.org
//

import { readFileSync, existsSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

import { Config } from '@dxos/config';

const baseConfig = readFileSync(path.join(__dirname, '../config.yml')).toString();

export const getConfig = (configPath) => {
  if (!existsSync) {
    throw new Error('Configuration file does not exist. Please init default cli profile or provide proper path to config file.');
  }

  const profileConfig = yaml.load(readFileSync(configPath));
  const config = new Config(profileConfig, yaml.load(baseConfig));

  return config;
};