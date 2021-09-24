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
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material';
import {
  Menu as MenuIcon,
  MoreVert as MoreVertIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { useConfig } from '../hooks';
import { DXOS as DXOSIcon } from '../icons';
// import { Statusbar } from './Statusbar';

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
 * Menu.
 */
const ContainerMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls='long-menu'
        aria-expanded={menuOpen ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Keyhole</MenuItem>
      </Menu>
    </>
  );
};

/**
 * Root application component.
 */
export const Container = ({ children, sidebar }: ContainerProps) => {
  const config = useConfig();
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <Box
      sx={{
        display: 'flex',
        // flexDirection: 'column',
        height: '100vh'
      }}
    >
      <AppBar position='fixed' open={drawerOpen}>
        <Toolbar
          sx={{
            '*': {
              color: theme => theme.palette.mode === 'dark' ? theme.palette.background.default: undefined
            }
          }}
        >
          <Box>
            <IconButton
              sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
              aria-label='open drawer'
              edge='start'
              size='small'
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography variant='h6'>
            {config.app.title}
          </Typography>

          <Box sx={{ flex: 1 }} />

          <ContainerMenu />
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
        open={drawerOpen}
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
          <IconButton size='small' onClick={() => setDrawerOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        {sidebar || null}
      </Drawer>

      <Main open={drawerOpen}>
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
