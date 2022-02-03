//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';

import { ConfigV1Object } from '@dxos/config';

import { IService } from '../types';
import { useConfig } from './useConfig';
import { useRequest, httpRequester } from './useRequest';

export const serviceActionRequester = async (config: ConfigV1Object, service: string, action: string) => {
  return httpRequester({
    url: urlJoin(config.runtime?.services?.app?.server, config.runtime?.services?.kube?.endpoints?.services),
    method: 'POST',
    params: { service, action }
  });
};

export const useServices = (cached = true) => {
  const config = useConfig();
  return useRequest<IService[]>({
    url: urlJoin(config.runtime?.services?.app?.server, config.runtime?.services?.kube?.endpoints?.services),
    method: 'GET'
  }, cached);
};
