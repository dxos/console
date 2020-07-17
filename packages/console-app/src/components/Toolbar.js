//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core';
import MuiToolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    whiteSpace: 'nowrap',

    '& > button': {
      margin: theme.spacing(0.5)
    }
  }
}));

// TODO(burdon): Tabs.
const Toolbar = ({ children }) => {
  const classes = useStyles();

  return (
    <MuiToolbar disableGutters className={classes.toolbar}>
      {children}
    </MuiToolbar>
  );
};

export default Toolbar;
