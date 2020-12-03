//
// Copyright 2020 DXOS.org
//

import React from 'react';
import Link from '@material-ui/core/Link';

import { getServiceUrl } from '../util/config';

/**
 * Render IPFS links in package.
 * @param {Object} config
 * @param {string} type
 * @param {string} pkg
 * @param {string} [text]
 */
const PackageLink = ({ config, type, pkg, text }) => {
  // eslint-disable-next-line default-case
  switch (type) {
    // Apps and Files
    case 'wrn:app':
    case 'wrn:file': {
      const cid = pkg['/'];
      const ipfsUrl = getServiceUrl(config, 'ipfs.gateway', { path: `${cid}` });
      if (!cid) {
        console.warn('Invalid CID', type, pkg);
        return;
      }

      return (
        <Link
          key={cid}
          href={ipfsUrl}
          title={cid}
          target={cid}
        >
          {text || cid}
        </Link>
      );
    }

    // Bots
    case 'wrn:bot': {
      const packageLinks = [];
      Object.keys(pkg).forEach((platform) => {
        Object.keys(pkg[platform]).forEach(arch => {
          const cid = pkg[platform][arch]['/'];
          const ipfsUrl = getServiceUrl(config, 'ipfs.gateway', { path: `${cid}` });
          if (!cid) {
            console.warn('Invalid CID', type, pkg);
            return;
          }

          const label = `${platform}/${arch}: ${cid}`;
          packageLinks.push(
            <Link
              key={cid}
              href={ipfsUrl}
              title={label}
              target={pkg}
            >
              {cid}
            </Link>
          );
        });
      });

      return (
        <>{packageLinks}</>
      );
    }
  }

  return null;
};

export default PackageLink;
