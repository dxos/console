//
// Copyright 2020 DxOS.org.org
//

import React from 'react';
import Link from '@material-ui/core/Link';

import { getServiceUrl } from '../util/config';

const getAppUrl = (config, { name, version }) => {
  const base = getServiceUrl(config, 'app.server');
  const pathComponents = [base];

  // TODO(burdon): Fix.
  // `wire app serve` expects the /wrn/ prefix.
  // That is OK in the production config where we can make it part of the the route,
  // but in development it must be prepended since we don't want to make it part of services.app.server.
  if (!base.startsWith(`/${config.services.app.prefix}`) && !base.endsWith(`/${config.services.app.prefix}`)) {
    pathComponents.push(config.services.app.prefix.substring(1));
  }

  if (version) {
    pathComponents.push(`${name}@${version}`);
  } else {
    pathComponents.push(name);
  }
  return `${pathComponents.join('/')}/`;
};

/**
 * Render link to record in WNS.
 * @param {Object} config
 * @param {string} name
 * @param {string} [text]
 * @param {string} [version]
 */
const AppLink = ({ config, name, version, text }) => {
  const fullURL = getAppUrl(config, { name, version });
  return <Link href={fullURL} target={name}>{text || name}</Link>;
};

export default AppLink;
