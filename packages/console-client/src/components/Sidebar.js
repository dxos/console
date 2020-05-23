//
// Copyright 2020 DxOS
//

import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  list: {
    padding: 0
  },

  icon: {
    color: theme.palette.grey[500]
  },

  selected: {
    color: theme.palette.primary.main
  }
}));

const Sidebar = ({ modules: { services, settings } }) => {
  const classes = useStyles();

  // TODO(burdon): Change.
  const router = {};

  const Modules = ({ modules }) => (
    <List aria-label="items" className={classes.list}>
      {modules.map(({ path, title, icon: Icon }) => (
        <ListItem button selected={path === router.pathname} key={path} onClick={() => router.push(path)}>
          <ListItemIcon classes={{ root: classes.icon }}>
            <Icon className={clsx(classes.icon, path === router.pathname && classes.selected)} />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <div className={classes.root}>
      <Modules modules={services} />
      <Modules modules={settings} />
    </div>
  );
};

export default Sidebar;
