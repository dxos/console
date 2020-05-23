//
// Copyright 2020 DxOS
//

import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';

import { FullScreen } from '@dxos/gem-core';

import config from '../../config.json';
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
    flex: 1
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    width: 200,
    borderRight: `1px solid ${theme.palette.primary.dark}`
  },
  main: {
    display: 'flex',
    flex: 1
  },
  cooter: {
    display: 'flex',
    flexShrink: 0
  }
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  const { modules } = useContext(ConsoleContext);

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
