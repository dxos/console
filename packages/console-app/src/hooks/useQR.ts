//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';

import { IAuthQR } from '../types';
import { useConfig } from './useConfig';
import { useRequest } from './useRequest';

const authQRPath = '/app/auth-setup';

export const useQR = (cached = true) => {
  const config = useConfig();
  return useRequest<IAuthQR>({
    url: urlJoin(config.services.app?.server, authQRPath),
    method: 'GET'
  }, cached);
};
