//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';

import { ConfigObject } from '@dxos/config';

import { IService } from '../types';
import { useConfig } from './useConfig';
import { useRequest, httpRequester } from './useRequest';

const getReqParams = (config: ConfigObject, usage: boolean, cached: boolean) => {
  const query = { usage: usage.toString(), cached: cached.toString() };
  return {
    url: urlJoin(config.runtime?.services?.app?.server, config.runtime?.services?.kube?.endpoints?.services, { query }),
    method: 'GET'
  };
};

export const serviceRequester = async (config: ConfigObject, usage: boolean, cached: boolean) => {
  return httpRequester(getReqParams(config, usage, cached));
};

export const serviceActionRequester = async (config: ConfigObject, service: string, action: string) => {
  return httpRequester({
    url: urlJoin(config.runtime?.services?.app?.server, config.runtime?.services?.kube?.endpoints?.services),
    method: 'POST',
    params: { service, action }
  });
};

export const useServices = (cached = true, usage = true) => {
  const config = useConfig();

  return useRequest<IService[]>(getReqParams(config, usage, cached), cached);
};
