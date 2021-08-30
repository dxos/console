//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { makeStyles, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { IPanel } from '../panels';

const useStyles = makeStyles(theme => ({
  list: {
    padding: 0
  },
  icon: {
    minWidth: 38
  }
}));

interface SidebarProperties {
  panels: IPanel[]
  selected: string | undefined
  onSelect: (path: string) => void
}

/**
 * Generic sidebar panel.
 * @constructor
 */
export const Sidebar = ({ panels, selected, onSelect }: SidebarProperties) => {
  const classes = useStyles();

  return (
    <div>
      <List className={classes.list}>
        {panels.map(({ path, label, icon: Icon }, i) => (
          <ListItem
            key={i}
            button
            selected={path === selected}
            onClick={() => onSelect(path)}
          >
            <ListItemIcon className={classes.icon}>
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={label}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
