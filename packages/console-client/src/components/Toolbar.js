//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core';
import MuiToolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',

    '& > button': {
      margin: theme.spacing(0.5),
    }
  }
}));

const Toolbar = ({ children }) => {
  const classes = useStyles();

  return (
    <MuiToolbar variant="dense" disableGutters className={classes.toolbar}>
      {children}
    </MuiToolbar>
  );
};

export default Toolbar;
