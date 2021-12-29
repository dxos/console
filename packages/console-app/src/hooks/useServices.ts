//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';

import { IService } from '../types';
import { useConfig } from './useConfig';
import { useRequest } from './useRequest';

export const useServices = (cached = true) => {
  const config = useConfig();
  return useRequest<IService[]>({
    url: urlJoin(config.runtime?.services?.app?.server, config.runtime?.services?.kube?.endpoints?.services),
    method: 'GET'
  }, cached);
};
