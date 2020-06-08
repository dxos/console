//
// Copyright 2020 DxOS.org
//

import clsx from 'clsx';
import moment from 'moment';
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

import { ConsoleContext, useStatusReducer } from '../hooks';

import Error from '../components/Error';

import VersionCheck from './VersionCheck';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: grey[900],
    color: grey[400]
  },
  left: {
    display: 'flex',
    width: 160
  },
  right: {
    display: 'flex',
    width: 160,
    justifyContent: 'flex-end'
  },
  center: {
    display: 'flex',
    fontFamily: 'monospace',
    fontSize: 'large',
    '& div': {
      margin: 4
    }
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
  loading: {
    color: theme.palette.primary.dark
  }
}));

/**
 * Displays status indicators at the bottom of the page.
 */
const StatusBar = () => {
  const classes = useStyles();
  const [{ loading, error }] = useStatusReducer();
  const [isLoading, setLoading] = useState(loading);
  const { config } = useContext(ConsoleContext);
  const { build: { name, buildDate, version } } = config;

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
        <ErrorIcon className={clsx(classes.icon, classes.error)} />
      );
    } else {
      return (
        <RunningIcon className={clsx(classes.icon, classes.running)} />
      );
    }
  };

  return (
    <>
      <Toolbar className={classes.root}>
        <div className={classes.left}>
          <Link className={classes.link} href={config.app.website} rel='noreferrer' target='_blank'>
            <PublicIcon />
          </Link>
        </div>

        <div className={classes.center}>
          <div>{name} ({version})</div>
          <div>{moment(buildDate).format('L')}</div>
          <VersionCheck />
        </div>

        <div className={classes.right}>
          <LoadingIcon className={clsx(classes.icon, isLoading && classes.loading)} />
          <StatusIcon error={error} />
        </div>
      </Toolbar>

      <Error error={error} />
    </>
  );
};

export default StatusBar;
