//
// Copyright 2020 DXOS.org
//

import React from 'react';
import get from 'lodash.get';
import Link from '@material-ui/core/Link';

import { getServiceUrl } from '../util/config';

const getAppUrl = (config, { wrn }) => {
  const base = getServiceUrl(config, 'app.server');
  const pathComponents = [base];

  // TODO(burdon): Fix.
  // `wire app serve` expects the /app/ prefix.
  // That is OK in the production config where we can make it part of the the route,
  // but in development it must be prepended since we don't want to make it part of services.app.server.
  const prefix = get(config, 'services.app.prefix');
  if (prefix && !base.startsWith(`/${prefix}`) && !base.endsWith(`/${prefix}`)) {
    pathComponents.push(prefix.substring(1));
  }

  pathComponents.push(encodeURIComponent(wrn));
  return `${pathComponents.join('/')}/`;
};

/**
 * Render link to record in WNS.
 * @param {Object} config
 * @param {string} name
 * @param {string} [text]
 */
const AppLink = ({ config, wrn, text }) => {
  const fullURL = getAppUrl(config, { wrn });
  return <Link href={fullURL} target={wrn}>{text || wrn}</Link>;
};

export default AppLink;
