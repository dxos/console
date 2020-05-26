//
// Copyright 2020 DxOS.org
//

import isObject from 'lodash.isobject';
import omit from 'lodash.omit';
import transform from 'lodash.transform';
import React from 'react';
import { makeStyles } from '@material-ui/core';

import { JsonTreeView } from '@dxos/react-ux';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1
  }
}));

/**
 * Remove Apollo __typename directive.
 * @param {Object} data
 * @returns {Object}
 */
const removeTypename = data => transform(data, (result, value, key) => {
  if (key !== '__typename') {
    result[key] = isObject(value) ? ('__typename' in value ? omit(value, '__typename') : value) : value;
  }
}, {});

const Json = ({ data }) => {
  const classes = useStyles();

  // TODO(burdon): Bug expands when updated.
  return (
    <JsonTreeView className={classes.root} data={removeTypename(data)} />
  );
};

export default Json;
