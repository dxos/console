//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Link from '@material-ui/core/Link';
import LinkIcon from '@material-ui/icons/ExitToApp';

import { getServiceUrl } from '../util/config';

const QUERY = `
  query {
    getRecordsByIds(ids: [ "%ID%" ]) {
      id
      names
      bondId
      createTime
      expiryTime
      owners
      attributes {
        key
        value {
          string
          json
          reference {
            id
          }
        }
      }
    }
  }
`;

/**
 * Render link to record in WNS.
 * @param {Object} config
 * @param {string} id
 * @param {string} [text]
 * @param {boolean} icon
 */
const QueryLink = ({ config, id, text, icon = false }) => {
  const baseURL = getServiceUrl(config, 'wns.webui');
  const query = QUERY.replace('%ID%', id);

  // NOTE: Playground bug opens two tabs.
  const fullURL = encodeURI(`${baseURL}?query=${query}`);

  return (
    <Link href={fullURL} target='gql'>
      {icon && (
        <LinkIcon />
      )}
      {!icon && (
        text || id
      )}
    </Link>
  );
};

export default QueryLink;
