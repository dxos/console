//
// Copyright 2021 DXOS.org
//

import clsx from 'clsx';
import React, { useState } from 'react';

import {
  makeStyles, AppBar, Divider, Drawer, IconButton, Paper, Toolbar, Typography
} from '@mui/material';
import {
  AccountCircle as ProfileIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

import { useConfig } from '../hooks';
import { DXOS as DXOSIcon } from '../icons';

const drawerWidth = 220;

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
  logo: {
    display: 'flex',
    color: theme.palette.text.secondary,
    '& svg': {
      width: 100,
      height: 42
    }
  },
  sidebarIcon: {
    paddingRight: theme.spacing(2)
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerToolbar: {
    display: 'flex',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  drawerPaper: {
    width: drawerWidth
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
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default
    // margin: theme.spacing(1)
  },
  hide: {
    display: 'none'
  },
  expand: {
    flex: 1
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
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <div className={clsx(classes.sidebarIcon, { [classes.hide]: open })}>
            <IconButton
              aria-label='open drawer'
              edge='start'
              size='small'
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <Typography variant='h6'>
            {config.app.title}
          </Typography>
          <div className={classes.expand} />
          <IconButton
            edge='end'
            aria-label='account of current user'
            aria-haspopup='true'
            color='inherit'
          >
            <ProfileIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <Toolbar className={classes.drawerToolbar} disableGutters>
          <div className={classes.logo}>
            <DXOSIcon />
          </div>
          <div className={classes.expand} />
          <IconButton size='small' onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
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
