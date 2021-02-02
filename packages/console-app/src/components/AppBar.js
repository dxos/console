//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core';
import MuiAppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import blueGrey from '@material-ui/core/colors/blueGrey';
import GraphQLIcon from '@material-ui/icons/Adb';

import { graphqlApi } from '../client';
import DXOSIcon from '../icons/DXOS';

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.denseToolbar,

  logo: {
    marginRight: theme.spacing(2),
    color: theme.palette.grey[800],

    '& svg': {
      width: 100,
      height: 48
    }
  },

  logoLink: {
    lineHeight: 0
  },

  title: {
    display: 'flex',
    flex: 1,
    marginTop: 2,
    color: theme.palette.grey[800]
  },

  link: {
    color: blueGrey[900]
  }
}));

const AppBar = ({ config }) => {
  const classes = useStyles();

  return (
    <>
      <MuiAppBar position='fixed' elevation={0}>
        <Toolbar>
          <Link classes={{ root: classes.logoLink }} href='/'>
            <div className={classes.logo}>
              <DXOSIcon />
            </div>
          </Link>
          <div className={classes.title}>
            <Typography variant='h6'>{config.app.title}</Typography>
          </div>
          <div>
            <Link
              className={classes.link}
              href={graphqlApi(config)}
              rel='noreferrer'
              target='_blank'
              title='Console GraphQL'
            >
              <GraphQLIcon />
            </Link>
          </div>
        </Toolbar>
      </MuiAppBar>

      <div className={classes.offset} />
    </>
  );
};

export default AppBar;
