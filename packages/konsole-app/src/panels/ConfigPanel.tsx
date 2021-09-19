//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { makeStyles } from '@mui/styles';

import { JsonTreeView } from '@dxos/react-ux';

import { useConfig } from '../hooks';

const useStyles = makeStyles(theme => ({
  panel: {
    display: 'flex',
    flex: 1,
    overflow: 'scroll',
    margin: theme.spacing(1)
  },
  json: {
    width: '100%'
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
    <div className={classes.panel}>
      <JsonTreeView className={classes.json} data={config} />
    </div>
  );
};
