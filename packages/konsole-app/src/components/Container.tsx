//
// Copyright 2021 DXOS.org
//

import React, { useState } from 'react';

import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import {
  AccountCircle as ProfileIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { useConfig } from '../hooks';
import { DXOS as DXOSIcon } from '../icons';

const drawerWidth = 220;

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open'
})<{ open?: boolean; }>(({ theme, open }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.background.default: undefined,
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    })
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar, // Necessary for content to be below AppBar.
  justifyContent: 'flex-end'
}));

type ContainerProps = {
  children?: JSX.Element
  sidebar?: JSX.Element
};

/**
 * Root application component.
 * @constructor
 */
export const Container = ({ children, sidebar }: ContainerProps) => {
  const config = useConfig();
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh'
      }}
    >
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <Box>
            <IconButton
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
              aria-label='open drawer'
              edge='start'
              size='small'
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography variant='h6'>
            {config.app.title}
          </Typography>
          <Box sx={{ flex: 1 }} />
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
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <Toolbar
          disableGutters
          sx={{
            marginLeft: 2,
            marginRight: 1
          }}
        >
          <Box
            sx={{
              display: 'flex',
              color: theme => theme.palette.text.primary,
              '& svg': {
                width: 100,
                height: 42
              }
            }}
          >
            <DXOSIcon />
          </Box>
          <Box sx={{ flex: 1 }} />
          <IconButton size='small' onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        {sidebar || null}
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {children}
        </Box>
      </Main>
    </Box>
  );
};
