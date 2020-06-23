//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core';

import { JsonTreeView } from '@dxos/react-ux';

import { omitDeep } from '../util/omit';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1
  }
}));

const Json = ({ data }) => {
  const classes = useStyles();

  return (
    <JsonTreeView className={classes.root} data={omitDeep(data, '__typename')} />
  );
};

export default Json;
