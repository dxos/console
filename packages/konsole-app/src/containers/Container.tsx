//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React, { useState } from 'react';

import {
  makeStyles, AppBar, Divider, Drawer, IconButton, Paper, Toolbar, Typography
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons';

import { useConfig } from '../hooks';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end',
    // Necessary for content to be below app bar.
    ...theme.mixins.toolbar
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: -drawerWidth,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  contentHeader: {
    // Necessary for content to be below app bar.
    ...theme.mixins.toolbar
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0
  },
  contentPaper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    margin: theme.spacing(1)
  },
  hide: {
    display: 'none'
  }
}));

type ContainerProperties = {
  children: JSX.Element
  sidebar: JSX.Element
};

/**
 * Root application component.
 * @constructor
 */
export const Container = ({ children, sidebar }: ContainerProperties) => {
  const classes = useStyles();
  const config = useConfig();
  const [open, setOpen] = useState(true);

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            className={clsx({ [classes.hide]: open })}
            aria-label='open drawer'
            edge='start'
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography>
            {config.app.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {sidebar}
      </Drawer>

      <main
        className={clsx(classes.content, { [classes.contentShift]: open })}
      >
        <div className={classes.contentHeader} />
        <Paper className={classes.contentPaper}>
          {children}
        </Paper>
      </main>
    </div>
  );
};
