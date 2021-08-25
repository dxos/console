//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles, AppBar, Toolbar, Typography } from '@material-ui/core';

import { ConfigPanel, RecordPanel } from '../containers';
import { useConfig } from '../hooks';

const useStyles = makeStyles(theme => ({
  content: {
    margin: theme.spacing(2)
  }
}));

/**
 * Root application component.
 * @constructor
 */
export const App = () => {
  const classes = useStyles();
  const config = useConfig();

  // TODO(burdon): Panel abstraction and routes.

  return (
    <div>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <Typography>
            {config.app.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.content}>
        <RecordPanel />
        <ConfigPanel />
      </div>
    </div>
  );
};
