//
// Copyright 2020 DxOS.org
//

import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';

import { FullScreen } from '@dxos/gem-core';

import { ConsoleContext } from '../hooks';

import AppBar from '../components/AppBar';
import Sidebar from '../components/Sidebar';
import StatusBar from './StatusBar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden'
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    width: 200,
    borderRight: `1px solid ${theme.palette.divider}`
  },
  footer: {
    display: 'flex',
    flexShrink: 0
  }
}));

/**
 * Main layout for app.
 */
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
          <div className={classes.main}>
            {children}
          </div>
        </div>
        <div className={classes.footer}>
          <StatusBar />
        </div>
      </div>
    </FullScreen>
  );
};

export default Layout;
