//
// Copyright 2020 DxOS.org.org
//

import React from 'react';

import ExitToApp from '@material-ui/icons/ExitToApp';
import Link from '@material-ui/core/Link';

import { getServiceUrl } from '../util/config';

const QUERY = `{
  queryRecords(attributes: [
   { key: "name", value: { string: "%NAME%" }}]) {
     id type name bondId createTime expiryTime owners attributes { key, value { string, json } }
   }
}`;

/**
 * Render link to record in WNS.
 * @param {Object} config
 * @param {string} name
 * @param {string} [text]
 */
const QueryLink = ({ config, name, text, icon = false}) => {
  const baseURL = getServiceUrl(config, 'wns.webui');
  const query = QUERY.replace('%NAME%', name);
  const fullURL= encodeURI(`${baseURL}?query=${query}`);

  if (icon) {
    return <Link href={fullURL} target='wns'>
      <ExitToApp />
    </Link>
  }
  return <Link href={fullURL} target='wns'>{text || name}</Link>;
};

export default QueryLink;
