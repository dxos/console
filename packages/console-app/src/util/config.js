//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import buildUrl from 'build-url';
import get from 'lodash.get';

/**
 * Returns the service URL that can be used by the client.
 * @param {Object} config
 * @param {string} service
 * @param {Object} [options]
 * @param {string} [options.path]
 * @param {boolean} [options.absolute]
 * @returns {string|*}
 */
export const getServiceUrl = (config, service, options = {}) => {
  const { path, absolute = false } = options;
  const { routes, services } = config;

  const appendPath = (url) => buildUrl(url, { path });

  // Relative route.
  const routePath = get(routes, service);
  if (routePath) {
    if (absolute) {
      assert(typeof window !== 'undefined');
      return buildUrl(window.location.origin, { path: appendPath(routePath) });
    }

    // Relative.
    return appendPath(routePath);
  }

  // Absolute service path.
  const serviceUrl = get(services, service);
  assert(serviceUrl, `Invalid service definition: ${service}`);
  return appendPath(serviceUrl);
};
