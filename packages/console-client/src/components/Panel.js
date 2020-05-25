//
// Copyright 2020 DxOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'scroll'
  }
}));

const Panel = ({ toolbar, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {toolbar}
      <Paper className={classes.container}>
        {children}
      </Paper>
    </div>
  );
};

export default Panel;
