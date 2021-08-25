//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles, AppBar, Paper, Toolbar, Typography } from '@material-ui/core';

import { useConfig } from '../hooks';

const useStyles = makeStyles(theme => ({
  pre: {
    margin: 0,
    padding: theme.spacing(2)
  }
}));

/**
 * Root application component.
 * @constructor
 */
export const App = () => {
  const classes = useStyles();
  const config = useConfig();

  return (
    <div>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <Typography>
            {config.app.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper>
        <pre className={classes.pre}>
          {JSON.stringify(config, undefined, 2)}
        </pre>
      </Paper>
    </div>
  );
};
