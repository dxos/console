//
// Copyright 2020 DXOS.org
//

import React from 'react';
import Link from '@material-ui/core/Link';

import { getServiceUrl } from '../util/config';

/**
 * Render IPFS links in package.
 * @param {Object} config
 * @param {string} [type]
 * @param {string} pkg
 * @param {string} [text]
 */
const PackageLink = ({ config, type, pkg, text }) => {
  // eslint-disable-next-line default-case
  switch (type) {
    case 'wrn://dxos/type/application/web': {
      const cid = pkg['/'];
      const ipfsUrl = getServiceUrl(config, 'ipfs.gateway', { path: `${cid}` });
      return <Link href={ipfsUrl} key={cid} target={cid}>{text || cid}</Link>;
    }
    case 'wrn://dxos/type/application/bot': {
      const packageLinks = [];
      Object.keys(pkg).forEach((platform, i) => {
        Object.keys(pkg[platform]).forEach(arch => {
          const cid = pkg[platform][arch]['/'];
          const ipfsUrl = getServiceUrl(config, 'ipfs.gateway', { path: `${cid}` });
          packageLinks.push(
            <div>
              <Link
                key={cid}
                href={ipfsUrl}
                title={cid}
                target={pkg}
              >
                {platform}/{arch}: {cid}
              </Link>
            </div>
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
