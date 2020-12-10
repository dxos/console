//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';

import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LinkIcon from '@material-ui/icons/ExitToApp';
import ListItemText from '@material-ui/core/ListItemText';

import EXTENSIONS from '../gql/extensions.graphql';
import { useQueryStatusReducer } from '../hooks';

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
    minWidth: 40,
    color: theme.palette.grey[500]
  },

  selected: {
    color: theme.palette.primary.main
  },

  expand: {
    flex: 1
  }
}));

const Sidebar = ({ modules: { services, settings } }) => {
  const classes = useStyles();
  const history = useHistory();
  const { module } = useParams();

  const { data: extensionsData } = useQueryStatusReducer(useQuery(EXTENSIONS));
  const extensions = extensionsData ? JSON.parse(extensionsData.extensions.json) : [];

  const isSelected = path => path === `/${module}`;

  const Modules = ({ modules }) => (
    <List aria-label='items' className={classes.list}>
      {modules.map(({ path, title, icon: Icon }) => (
        <ListItem button selected={isSelected(path)} key={path} onClick={() => history.push(path)}>
          <ListItemIcon classes={{ root: classes.icon }}>
            <Icon className={clsx(classes.icon, isSelected(path) && classes.selected)} />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItem>
      ))}
    </List>
  );

  const Extensions = ({ extensions }) => (
    <List aria-label='items' className={classes.list}>
      {extensions.map(({ url, title }) => (
        <ListItem button key={url} onClick={() => { window.location = url; return true; }}>
          <ListItemIcon classes={{ root: classes.icon }}>
            <LinkIcon className={clsx(classes.icon)} />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <div className={classes.root}>
      <Modules modules={services} />
      <Extensions extensions={extensions} />
      <div className={classes.expand} />
      <Modules modules={settings} />
    </div>
  );
};

export default Sidebar;
