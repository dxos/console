//
// Copyright 2020 DxOS
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

const removeTypename = data => transform(data, (result, value, key) => {
  result[key] = isObject(value) && '__typename' in value ? omit(value, '__typename') : value;
});

const Json = ({ data }) => {
  const classes = useStyles();

  // TODO(burdon): Bug expands when updated.
  return (
    <JsonTreeView className={classes.root} data={removeTypename(data)} />
  );
};

export default Json;
