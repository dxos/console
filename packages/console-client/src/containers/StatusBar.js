//
// Copyright 2020 DxOS
//

import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import LoadingIcon from '@material-ui/icons/Wifi';
import RunningIcon from '@material-ui/icons/CheckCircle';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import config from '../../config.json';
import { version } from '../../package.json';
import { useStatusReducer } from '../hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: grey[900],
    color: '#EEE',
    height: 32,
    padding: 4
  },
  left: {
    width: 160
  },
  right: {
    width: 160,
    textAlign: 'right'
  },
  center: {
    flex: 1,
    textAlign: 'center'
  },
  icon: {
    margin: '0 2px'
  },
  error: {
    color: red[500]
  },
  running: {
    color: green[500]
  },
  loading:{
    color: theme.palette.primary.dark
  }
}));

const StatusBar = () => {
  const classes = useStyles();
  const [{ loading, error }] = useStatusReducer();
  const [isLoading, setLoading] = useState(loading);

  useEffect(() => {
    let t;
    if (loading) {
      setLoading(loading);
      t = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    return () => clearTimeout(t);
  }, [loading]);

  const StatusIcon = ({ error }) => {
    if (error) {
      return (
        <ErrorIcon className={clsx(classes.icon, classes.error)} title={String(error)} />
      );
    } else {
      return (
        <RunningIcon className={clsx(classes.icon, classes.running)} />
      );
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.left} />
      <div className={classes.center}>(c) {config.app.org} {version}</div>
      <div className={classes.right}>
        <LoadingIcon className={clsx(classes.icon, isLoading && classes.loading)} />
        <StatusIcon error={error} />
      </div>
    </div>
  );
};

export default StatusBar;
