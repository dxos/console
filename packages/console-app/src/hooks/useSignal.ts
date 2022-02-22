//
// Copyright 2021 DXOS.org
//

import { ISignal } from '../types';
import { useConfig } from './useConfig';
import { useRequest } from './useRequest';

export const useSignal = (cached = true) => {
  const config = useConfig();
  return useRequest<ISignal[]>({
    url: config.get('runtime.services.signal.status') ?? '',
    method: 'GET'
  }, cached);
};
