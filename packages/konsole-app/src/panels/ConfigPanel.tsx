//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles, Divider } from '@material-ui/core';

import { useConfig } from '../hooks';

const useStyles = makeStyles(theme => ({
  pre: {
    margin: 0,
    padding: theme.spacing(2)
  },
  panel: {
    margin: theme.spacing(1)
  }
}));

/**
 * Displays the config panel
 * @constructor
 */
export const ConfigPanel = () => {
  const classes = useStyles();
  const config = useConfig();

  return (
    <>
      <Divider />
      <div className={classes.panel}>
        <pre className={classes.pre}>
          {JSON.stringify(config, undefined, 2)}
        </pre>
      </div>
    </>
  );
};
