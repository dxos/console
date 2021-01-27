//
// Copyright 2020 DXOS.org
//

import { Registry } from '@dxos/registry-client';

import { getServiceUrl } from '../util/config';

export const useRegistry = (config) => {
  const endpoint = getServiceUrl(config, 'registry.server', { absolute: true });
  const registry = new Registry(endpoint);

  return {
    registry,

    // TODO(burdon): Separate hook.
    webui: getServiceUrl(config, 'registry.webui', { absolute: true })
  };
};
