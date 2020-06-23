//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {}
}));

const Signal = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} />
  );
};

export default Signal;
