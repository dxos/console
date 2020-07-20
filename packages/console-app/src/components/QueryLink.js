//
// Copyright 2020 DXOS.org.org
//

import React from 'react';

import ExitToApp from '@material-ui/icons/ExitToApp';
import Link from '@material-ui/core/Link';

import { getServiceUrl } from '../util/config';

// TODO(burdon): print actual GRAPHQL query.
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

  // TODO(burdon): This doesn't work.
  const fullURL = encodeURI(`${baseURL}?query=${query}`);

  console.log(fullURL);

  if (icon) {
    return (
      <Link href={fullURL} target='WNS_GraphQL'>
        <ExitToApp />
      </Link>
    );
  }
  return (
    <Link href={fullURL} target='wns'>{text || name}</Link>
  );
};

export default QueryLink;
