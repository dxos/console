//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles, AppBar, Paper, Toolbar, Typography } from '@material-ui/core';

import { useConfig, useRecords } from '../hooks';
import { RecordsTable } from './RecordsTable';

const useStyles = makeStyles(theme => ({
  pre: {
    margin: 0,
    padding: theme.spacing(2)
  },
  content: {
    margin: theme.spacing(2)
  },
  panel: {
    margin: theme.spacing(1)
  }
}));

/**
 * Root application component.
 * @constructor
 */
export const App = () => {
  const classes = useStyles();
  const config = useConfig();
  const records = useRecords();

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
        <Paper>
          <Toolbar variant='dense'>
            <Typography>Records</Typography>
          </Toolbar>
          <div className={classes.panel}>
            <RecordsTable records={records} />
          </div>
        </Paper>

        <Paper>
          <Toolbar variant='dense'>
            <Typography>Config</Typography>
          </Toolbar>
          <div className={classes.panel}>
            <pre className={classes.pre}>
              {JSON.stringify(config, undefined, 2)}
            </pre>
          </div>
        </Paper>
      </div>
    </div>
  );
};
