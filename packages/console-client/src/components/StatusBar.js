//
// Copyright 2020 DxOS.org
//

import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import ErrorIcon from '@material-ui/icons/Error';
import LoadingIcon from '@material-ui/icons/Wifi';
import RunningIcon from '@material-ui/icons/CheckCircle';
import PublicIcon from '@material-ui/icons/Public';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import { version } from '../../package.json';
import { ConsoleContext, useStatusReducer } from '../hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: grey[900],
    color: grey[400]
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
  link: {
    color: grey[400]
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
  const { config } = useContext(ConsoleContext);

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
    <Toolbar className={classes.root}>
      <div className={classes.left}>
        <Link className={classes.link} href={config.app.website} rel="noreferrer" target="_blank">
          <PublicIcon />
        </Link>
      </div>
      <div className={classes.center}>(c) {config.app.org} {version}</div>
      <div className={classes.right}>
        <LoadingIcon className={clsx(classes.icon, isLoading && classes.loading)} />
        <StatusIcon error={error} />
      </div>
    </Toolbar>
  );
};

export default StatusBar;
