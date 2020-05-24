//
// Copyright 2020 DxOS
//

import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import { FullScreen } from '@dxos/gem-core';

import StatusBar from '../containers/StatusBar';
import AppBar from './AppBar';
import Sidebar from './Sidebar';
import { ConsoleContext } from '../hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    width: 180,
    borderRight: `1px solid ${theme.palette.primary.dark}`
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  cooter: {
    display: 'flex',
    flexShrink: 0
  }
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  const { config, modules } = useContext(ConsoleContext);

  return (
    <FullScreen>
      <div className={classes.root}>
        <AppBar config={config} />
        <div className={classes.container}>
          <div className={classes.sidebar}>
            <Sidebar modules={modules} />
          </div>
          <Paper className={classes.main}>
            {children}
          </Paper>
        </div>
        <div className={classes.footer}>
          <StatusBar />
        </div>
      </div>
    </FullScreen>
  );
};

export default Layout;
