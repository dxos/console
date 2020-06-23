//
// Copyright 2020 DXOS.org
//

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl } from '../util/config';

export const useRegistry = (config) => {
  const endpoint = getServiceUrl(config, 'wns.server', { absolute: true });
  const registry = new Registry(endpoint);

  return {
    registry,

    // TODO(burdon): Separate hook.
    webui: getServiceUrl(config, 'wns.webui', { absolute: true })
  };
};
