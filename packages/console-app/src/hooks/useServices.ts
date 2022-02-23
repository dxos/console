//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';

import { Config } from '@dxos/config';

import { IService } from '../types';
import { useConfig } from './useConfig';
import { useRequest, httpRequester } from './useRequest';

const getReqParams = (config: Config, usage: boolean, cached: boolean) => {
  const query = { usage: usage.toString(), cached: cached.toString() };
  return {
    url: urlJoin(config.get('runtime.services.app.server'), config.get('runtime.services.kube.endpoints.services'), { query }),
    method: 'GET'
  };
};

export const serviceRequester = async (config: Config, usage: boolean, cached: boolean) => {
  return httpRequester(getReqParams(config, usage, cached));
};

export const serviceActionRequester = async (config: Config, service: string, action: string) => {
  return httpRequester({
    url: urlJoin(config.get('runtime.services.app.server'), config.get('runtime.services.kube.endpoints.services')),
    method: 'POST',
    params: { service, action }
  });
};

export const useServices = (cached = true, usage = true) => {
  const config = useConfig();

  return useRequest<IService[]>(getReqParams(config, usage, cached), cached);
};
