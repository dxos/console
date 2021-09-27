//
// Copyright 2021 DXOS.org
//

import { IService } from '../types';
import { useRequest } from './useRequest';

// TODO(burdon): Config.
// curl -s https://discovery.kube.dxos.network/kube/services | jq
const KUBE_SERVICES = 'https://logs.kube.dxos.network/kube/services';

export const useServices = (cached = true) => {
  return useRequest<IService[]>({ url: KUBE_SERVICES, method: 'GET' }, cached);
};
