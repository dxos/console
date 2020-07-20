//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Link from '@material-ui/core/Link';
import LinkIcon from '@material-ui/icons/ExitToApp';

import { getServiceUrl } from '../util/config';

const QUERY = `
  query {
    queryRecords(attributes: [{ key: "name", value: { string: "%NAME%" } }]) {
      id
      type
      name
      bondId
      createTime
      expiryTime
      owners
      attributes {
        key
        value {
          string
          json
        }
      }
    }
  }
`;

/**
 * Render link to record in WNS.
 * @param {Object} config
 * @param {string} name
 * @param {string} [text]
 * @param {boolean} icon
 */
const QueryLink = ({ config, name, text, icon = false }) => {
  const baseURL = getServiceUrl(config, 'wns.webui');
  const query = QUERY.replace('%NAME%', name);

  // NOTE: Playground bug opens two tabs.
  const fullURL = encodeURI(`${baseURL}?query=${query}`);

  return (
    <Link href={fullURL} target='gql'>
      {icon && (
        <LinkIcon />
      )}
      {!icon && (
        text || name
      )}
    </Link>
  );
};

export default QueryLink;
